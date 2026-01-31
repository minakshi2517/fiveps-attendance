"""Student management routes."""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from typing import List, Optional
from database import get_db
from models import Student
from schemas import StudentCreate, StudentResponse
from utils.face_recognition import (
    generate_face_encoding, 
    save_face_encoding, 
    detect_face_in_image,
    average_face_encodings,
    save_multiple_face_encodings
)
from utils.storage import save_profile_image, get_image_extension, save_multiple_profile_images
from utils.exif_extractor import extract_gps_from_image
import tempfile
import os

router = APIRouter(prefix="/api/students", tags=["students"])

@router.post("/register", response_model=StudentResponse)
async def register_student(
    name: str = Form(...),
    email: Optional[str] = Form(None),
    enrollment_id: str = Form(...),
    role: str = Form("Student"),
    images: List[UploadFile] = File(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Register a new student with face encoding and geotag extraction.
    """
    # Check if student already exists
    if email:
        result = await db.execute(
            select(Student).where(
                (Student.email == email) | (Student.enrollment_id == enrollment_id)
            )
        )
    else:
        result = await db.execute(
            select(Student).where(Student.enrollment_id == enrollment_id)
        )
    existing_student = result.scalar_one_or_none()
    
    if existing_student:
        raise HTTPException(
            status_code=400,
            detail="Student with this email or enrollment ID already exists"
        )
    
    # Process all uploaded images
    valid_encodings = []
    valid_image_data = []
    valid_extensions = []
    
    for image in images:
        # Read image data
        image_data = await image.read()
        
        # Detect face in image
        if detect_face_in_image(image_data):
            # Generate face encoding with higher quality for registration
            face_encoding = generate_face_encoding(image_data, num_jitters=10)
            
            if face_encoding is not None:
                valid_encodings.append(face_encoding)
                valid_image_data.append(image_data)
                valid_extensions.append(get_image_extension(image.filename or "image.jpg"))
    
    if not valid_encodings:
        raise HTTPException(
            status_code=400,
            detail="No faces detected in any of the uploaded images. Please upload clear face photos."
        )
    
    # Compute averaged encoding
    averaged_encoding = average_face_encodings(valid_encodings)
    
    if averaged_encoding is None:
        raise HTTPException(
            status_code=400,
            detail="Failed to generate face encodings. Please upload clear face photos."
        )
    
    # Extract GPS coordinates from the FIRST valid image for registration location
    gps_coords = None
    try:
        # Save to temp file for EXIF extraction
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            temp_file.write(valid_image_data[0])
            temp_path = temp_file.name
        
        gps_coords = extract_gps_from_image(temp_path)
        os.unlink(temp_path)  # Clean up temp file
    except Exception as e:
        print(f"Error extracting GPS from image: {e}")
    
    # Create student record
    student = Student(
        name=name,
        email=email,
        enrollment_id=enrollment_id,
        role=role,
        num_face_images=len(valid_encodings)
    )
    
    # Add GPS coordinates if available
    if gps_coords:
        student.registered_location_lat = gps_coords[0]
        student.registered_location_lon = gps_coords[1]
    
    db.add(student)
    await db.commit()
    await db.refresh(student)
    
    db.add(student)
    await db.commit()
    await db.refresh(student)
    
    # Save face encodings (single averaged and all individual)
    encoding_result = save_multiple_face_encodings(student.id, valid_encodings, averaged_encoding)
    
    # Save multiple profile images
    image_paths = save_multiple_profile_images(student.id, valid_image_data, valid_extensions)
    
    # Update student with file paths
    student.face_encoding_path = encoding_result['averaged']
    student.face_encoding_paths = ";".join(encoding_result['individual'])
    student.profile_image_path = image_paths[0]  # Use first image as main profile image
    
    await db.commit()
    await db.refresh(student)
    
    return student

@router.get("/", response_model=List[StudentResponse])
async def list_students(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """
    Get list of all registered students.
    """
    result = await db.execute(
        select(Student).offset(skip).limit(limit)
    )
    students = result.scalars().all()
    return students

@router.get("/{student_id}", response_model=StudentResponse)
async def get_student(
    student_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Get student details by ID.
    """
    result = await db.execute(
        select(Student).where(Student.id == student_id)
    )
    student = result.scalar_one_or_none()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return student

@router.put("/{student_id}", response_model=StudentResponse)
async def update_student(
    student_id: int,
    name: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    role: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db)
):
    """
    Update student information.
    """
    result = await db.execute(
        select(Student).where(Student.id == student_id)
    )
    student = result.scalar_one_or_none()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Update fields if provided
    if name:
        student.name = name
    if email:
        student.email = email
    if role:
        student.role = role
    
    await db.commit()
    await db.refresh(student)
    
    return student

@router.get("/search/")
async def search_students(
    q: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Search students by name, email, or enrollment ID.
    """
    result = await db.execute(
        select(Student).where(
            or_(
                Student.name.ilike(f"%{q}%"),
                Student.email.ilike(f"%{q}%"),
                Student.enrollment_id.ilike(f"%{q}%")
            )
        )
    )
    students = result.scalars().all()
    return students

@router.delete("/all")
async def delete_all_students(
    db: AsyncSession = Depends(get_db)
):
    """
    Delete all students and their associated data.
    """
    import os
    from pathlib import Path
    
    # Get all students first to delete their files
    result = await db.execute(select(Student))
    students = result.scalars().all()
    
    for student in students:
        # Delete associated files
        if student.face_encoding_path and os.path.exists(student.face_encoding_path):
            os.remove(student.face_encoding_path)
        
        if student.profile_image_path and os.path.exists(student.profile_image_path):
            os.remove(student.profile_image_path)
        
        # Delete individual encoding files
        if student.face_encoding_paths:
            for path in student.face_encoding_paths.split(';'):
                if path and os.path.exists(path):
                    os.remove(path)
        
        await db.delete(student)
    
    await db.commit()
    
    return {"message": f"Successfully deleted {len(students)} students"}

@router.delete("/{student_id}")
async def delete_student(
    student_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a student and their associated data.
    """
    result = await db.execute(
        select(Student).where(Student.id == student_id)
    )
    student = result.scalar_one_or_none()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Delete associated files
    import os
    from pathlib import Path
    
    if student.face_encoding_path and os.path.exists(student.face_encoding_path):
        os.remove(student.face_encoding_path)
    
    if student.profile_image_path and os.path.exists(student.profile_image_path):
        os.remove(student.profile_image_path)
    
    await db.delete(student)
    await db.commit()
    
    return {"message": "Student deleted successfully"}

