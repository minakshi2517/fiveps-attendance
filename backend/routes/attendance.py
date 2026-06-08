"""Attendance management routes."""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func
from typing import List
from datetime import datetime, date
from database import get_db
from models import Student, Attendance, AttendanceStatus
from schemas import AttendanceResponse, AttendanceMarkResponse, StudentResponse
from utils.face_recognition import generate_face_encoding, load_all_face_encodings, match_face
# from utils.location import verify_location, get_location_info
from utils.storage import save_attendance_snapshot
from config import FACE_CONFIDENCE_THRESHOLD

router = APIRouter(prefix="/api/attendance", tags=["attendance"])

@router.post("/recognize")
async def recognize_face(
    image: UploadFile = File(...),
    # latitude: float = Form(None),
    # longitude: float = Form(None),
    db: AsyncSession = Depends(get_db)
):
    """
    Recognize face in real-time without marking attendance.
    Used for live tracking display.
    """
    # Read image data
    image_data = await image.read()
    
    # Generate face encoding with slight jittering for better accuracy
    captured_encoding = generate_face_encoding(image_data, num_jitters=2)
    
    if captured_encoding is None:
        return {
            "success": False,
            "message": "No face detected",
            "student": None,
            "confidence": 0
        }
    
    # Load all known face encodings
    known_encodings = load_all_face_encodings()
    
    if not known_encodings:
        return {
            "success": False,
            "message": "No registered students",
            "student": None,
            "confidence": 0
        }
    
    # Match face
    match_result = match_face(captured_encoding, known_encodings)
    
    if match_result is None:
        return {
            "success": False,
            "message": "Face not recognized",
            "student": None,
            "confidence": 0
        }
    
    student_id, confidence_score = match_result
    
    # Get student details
    result = await db.execute(
        select(Student).where(Student.id == student_id)
    )
    student = result.scalar_one_or_none()
    
    if not student:
        return {
            "success": False,
            "message": "Student not found",
            "student": None,
            "confidence": 0
        }
    
    return {
        "success": True,
        "message": "Face recognized",
        "student": {
            "id": student.id,
            "name": student.name,
            "enrollment_id": student.enrollment_id,
            "role": student.role,
            "email": student.email
        },
        "confidence": confidence_score
    }

@router.post("/mark", response_model=AttendanceMarkResponse)
async def mark_attendance(
    image: UploadFile = File(...),
    # latitude: float = Form(0),
    # longitude: float = Form(0),
    db: AsyncSession = Depends(get_db)
):
    """
    Mark attendance with face recognition and location verification.
    """
    # Read image data
    image_data = await image.read()
    
    # Generate face encoding from captured image with slight jittering
    captured_encoding = generate_face_encoding(image_data, num_jitters=2)
    
    if captured_encoding is None:
        return AttendanceMarkResponse(
            success=False,
            message="No face detected in the image. Please ensure your face is clearly visible.",
            attendance=None,
            student=None
        )
    
    # Load all known face encodings
    known_encodings = load_all_face_encodings()
    
    if not known_encodings:
        return AttendanceMarkResponse(
            success=False,
            message="No registered students found. Please register first.",
            attendance=None,
            student=None
        )
    
    # Match face
    match_result = match_face(captured_encoding, known_encodings)
    
    if match_result is None:
        return AttendanceMarkResponse(
            success=False,
            message="Face not recognized. Please ensure you are registered.",
            attendance=None,
            student=None
        )
    
    student_id, confidence_score = match_result
    
    # Check confidence threshold
    if confidence_score < FACE_CONFIDENCE_THRESHOLD:
        return AttendanceMarkResponse(
            success=False,
            message=f"Face match confidence too low ({confidence_score:.2%}). Please try again with better lighting.",
            attendance=None,
            student=None
        )
    
    # Get student details
    result = await db.execute(
        select(Student).where(Student.id == student_id)
    )
    student = result.scalar_one_or_none()
    
    if not student:
        return AttendanceMarkResponse(
            success=False,
            message="Student record not found.",
            attendance=None,
            student=None
        )
    
    # # Verify location
    #     # Location verification disabled for office-device based attendance
    # is_location_valid = True
    # location_name = "Office"
    # distance = 0
    
    # Check if attendance already marked today
    today = date.today()
    result = await db.execute(
        select(Attendance).where(
            and_(
                Attendance.student_id == student_id,
                func.date(Attendance.timestamp) == today,
                Attendance.status == AttendanceStatus.VERIFIED
            )
        )
    )
    existing_attendance = result.scalar_one_or_none()
    
    if existing_attendance:
        return AttendanceMarkResponse(
            success=False,
            message=f"Attendance already marked today at {existing_attendance.timestamp.strftime('%I:%M %p')}.",
            attendance=None,
            student=None
        )
    
    # Save attendance snapshot
    snapshot_path = save_attendance_snapshot(student_id, image_data)
    
    # Create verified attendance record
    attendance = Attendance(
        student_id=student_id,
       
        confidence_score=confidence_score,
        snapshot_path=snapshot_path,
        status=AttendanceStatus.VERIFIED
    )
    
    db.add(attendance)
    await db.commit()
    await db.refresh(attendance)
    
    return AttendanceMarkResponse(
        success=True,
        message=f"Attendance marked successfully for {student.name} at {location_name}!",
        attendance=AttendanceResponse(
            id=attendance.id,
            student_id=attendance.student_id,
            student_name=student.name,
            timestamp=attendance.timestamp,
            location_lat=attendance.location_lat,
            location_lng=attendance.location_lng,
            confidence_score=attendance.confidence_score,
            status=attendance.status,
            snapshot_path=attendance.snapshot_path
        ),
        student=StudentResponse.from_orm(student)
    )

@router.get("/today", response_model=List[AttendanceResponse])
async def get_today_attendance(
    db: AsyncSession = Depends(get_db)
):
    """
    Get all attendance records for today.
    """
    today = date.today()
    
    result = await db.execute(
        select(Attendance, Student).join(Student).where(
            func.date(Attendance.timestamp) == today
        ).order_by(Attendance.timestamp.desc())
    )
    
    records = result.all()
    
    attendance_list = []
    for attendance, student in records:
        attendance_list.append(
            AttendanceResponse(
                id=attendance.id,
                student_id=attendance.student_id,
                student_name=student.name,
                timestamp=attendance.timestamp,
                # location_lat=attendance.location_lat,
                # location_lng=attendance.location_lng,
                confidence_score=attendance.confidence_score,
                status=attendance.status,
                rejection_reason=attendance.rejection_reason,
                snapshot_path=attendance.snapshot_path
            )
        )
    
    return attendance_list

@router.get("/student/{student_id}", response_model=List[AttendanceResponse])
async def get_student_attendance(
    student_id: int,
    limit: int = 30,
    db: AsyncSession = Depends(get_db)
):
    """
    Get attendance history for a specific student.
    """
    result = await db.execute(
        select(Attendance, Student).join(Student).where(
            Attendance.student_id == student_id
        ).order_by(Attendance.timestamp.desc()).limit(limit)
    )
    
    records = result.all()
    
    attendance_list = []
    for attendance, student in records:
        attendance_list.append(
            AttendanceResponse(
                id=attendance.id,
                student_id=attendance.student_id,
                student_name=student.name,
                timestamp=attendance.timestamp,
                # location_lat=attendance.location_lat,
                # location_lng=attendance.location_lng,
                confidence_score=attendance.confidence_score,
                status=attendance.status,
                rejection_reason=attendance.rejection_reason,
                snapshot_path=attendance.snapshot_path
            )
        )
    
    return attendance_list

@router.get("/stats")
async def get_attendance_stats(
    db: AsyncSession = Depends(get_db)
):
    """
    Get attendance statistics.
    """
    today = date.today()
    
    # Total students
    total_students_result = await db.execute(select(func.count(Student.id)))
    total_students = total_students_result.scalar()
    
    # Today's attendance
    today_attendance_result = await db.execute(
        select(func.count(Attendance.id)).where(
            and_(
                func.date(Attendance.timestamp) == today,
                Attendance.status == AttendanceStatus.VERIFIED
            )
        )
    )
    today_attendance = today_attendance_result.scalar()
    
    # Today's rejections
    today_rejections_result = await db.execute(
        select(func.count(Attendance.id)).where(
            and_(
                func.date(Attendance.timestamp) == today,
                Attendance.status == AttendanceStatus.REJECTED
            )
        )
    )
    today_rejections = today_rejections_result.scalar()
    
    return {
        "total_students": total_students,
        "today_present": today_attendance,
        "today_absent": total_students - today_attendance,
        "today_rejections": today_rejections,
        "attendance_percentage": round((today_attendance / total_students * 100) if total_students > 0 else 0, 2)
    }

@router.delete("/{attendance_id}")
async def delete_attendance(
    attendance_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a single attendance record.
    """
    result = await db.execute(
        select(Attendance).where(Attendance.id == attendance_id)
    )
    attendance = result.scalar_one_or_none()
    
    if not attendance:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    
    # Delete snapshot file if exists
    import os
    if attendance.snapshot_path and os.path.exists(attendance.snapshot_path):
        os.remove(attendance.snapshot_path)
    
    await db.delete(attendance)
    await db.commit()
    
    return {"message": "Attendance record deleted successfully"}

@router.delete("/today/clear")
async def clear_today_attendance(
    db: AsyncSession = Depends(get_db)
):
    """
    Clear all today's attendance records.
    Requires admin authentication in production.
    """
    from sqlalchemy import delete as sql_delete
    
    today = date.today()
    
    # Get all today's attendance records
    result = await db.execute(
        select(Attendance).where(
            func.date(Attendance.timestamp) == today
        )
    )
    records = result.scalars().all()
    
    # Delete snapshot files
    import os
    for record in records:
        if record.snapshot_path and os.path.exists(record.snapshot_path):
            try:
                os.remove(record.snapshot_path)
            except Exception as e:
                print(f"Error deleting snapshot: {e}")
    
    # Delete all today's records
    await db.execute(
        sql_delete(Attendance).where(
            func.date(Attendance.timestamp) == today
        )
    )
    await db.commit()
    
    return {
        "message": f"Cleared {len(records)} attendance records for today",
        "count": len(records)
    }

@router.get("/logs")
async def get_attendance_logs(
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """
    Get attendance attempt logs (success and failures).
    """
    from models import AttendanceLog
    
    result = await db.execute(
        select(AttendanceLog).order_by(AttendanceLog.timestamp.desc()).limit(limit)
    )
    logs = result.scalars().all()
    
    return [
        {
            "id": log.id,
            "student_id": log.student_id,
            "timestamp": log.timestamp,
            "status": log.status,
            "confidence_score": log.confidence_score,
            "error_message": log.error_message
        }
        for log in logs
    ]

