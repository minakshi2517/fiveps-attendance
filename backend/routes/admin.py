"""Admin routes for authentication and system management."""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import shutil

from database import get_db
from models import Admin, Student, Attendance, AttendanceLog
from utils.auth import hash_password, verify_password, create_access_token, verify_token
from config import FACE_ENCODINGS_DIR, PROFILE_IMAGES_DIR, ATTENDANCE_SNAPSHOTS_DIR

router = APIRouter(prefix="/api/admin", tags=["admin"])
security = HTTPBearer()

# Pydantic schemas
class AdminRegister(BaseModel):
    username: str
    password: str
    email: Optional[str] = None

class AdminLogin(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str

class SystemResetRequest(BaseModel):
    confirm: bool = False

# Dependency to verify admin token
async def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> Admin:
    """Verify admin token and return admin user."""
    token = credentials.credentials
    payload = verify_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    username = payload.get("sub")
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    # Get admin from database
    result = await db.execute(select(Admin).where(Admin.username == username))
    admin = result.scalar_one_or_none()
    
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin user not found"
        )
    
    return admin

@router.post("/register", response_model=TokenResponse)
async def register_admin(
    admin_data: AdminRegister,
    db: AsyncSession = Depends(get_db)
):
    """Register a new admin user (first-time setup)."""
    # Check if admin already exists
    result = await db.execute(select(Admin).where(Admin.username == admin_data.username))
    existing_admin = result.scalar_one_or_none()
    
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin username already exists"
        )
    
    # Create new admin
    hashed_pwd = hash_password(admin_data.password)
    new_admin = Admin(
        username=admin_data.username,
        hashed_password=hashed_pwd,
        email=admin_data.email,
        created_at=datetime.utcnow()
    )
    
    db.add(new_admin)
    await db.commit()
    await db.refresh(new_admin)
    
    # Create access token
    access_token = create_access_token(data={"sub": admin_data.username})
    
    return TokenResponse(
        access_token=access_token,
        username=admin_data.username
    )

@router.post("/login", response_model=TokenResponse)
async def login_admin(
    login_data: AdminLogin,
    db: AsyncSession = Depends(get_db)
):
    """Admin login endpoint."""
    # Get admin from database
    result = await db.execute(select(Admin).where(Admin.username == login_data.username))
    admin = result.scalar_one_or_none()
    
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    # Verify password
    if not verify_password(login_data.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    # Update last login
    admin.last_login = datetime.utcnow()
    await db.commit()
    
    # Create access token
    access_token = create_access_token(data={"sub": admin.username})
    
    return TokenResponse(
        access_token=access_token,
        username=admin.username
    )

@router.get("/verify")
async def verify_admin_token(admin: Admin = Depends(get_current_admin)):
    """Verify admin token is valid."""
    return {
        "valid": True,
        "username": admin.username,
        "email": admin.email
    }

@router.post("/reset-system")
async def reset_system(
    reset_data: SystemResetRequest,
    admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    Complete system reset - deletes all data.
    Requires admin authentication.
    """
    if not reset_data.confirm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Confirmation required to reset system"
        )
    
    try:
        # Delete all database records
        await db.execute(delete(Attendance))
        await db.execute(delete(AttendanceLog))
        await db.execute(delete(Student))
        await db.commit()
        
        # Delete all stored files
        for directory in [FACE_ENCODINGS_DIR, PROFILE_IMAGES_DIR, ATTENDANCE_SNAPSHOTS_DIR]:
            if directory.exists():
                shutil.rmtree(directory)
                directory.mkdir(parents=True, exist_ok=True)
        
        return {
            "success": True,
            "message": "System reset completed successfully",
            "reset_by": admin.username,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error resetting system: {str(e)}"
        )

@router.get("/stats")
async def get_admin_stats(
    admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get system statistics for admin dashboard."""
    # Count students
    student_result = await db.execute(select(Student))
    total_students = len(student_result.scalars().all())
    
    # Count total attendance records
    attendance_result = await db.execute(select(Attendance))
    total_attendance = len(attendance_result.scalars().all())
    
    # Count attendance logs
    log_result = await db.execute(select(AttendanceLog))
    total_logs = len(log_result.scalars().all())
    
    return {
        "total_students": total_students,
        "total_attendance_records": total_attendance,
        "total_attendance_attempts": total_logs,
        "admin_username": admin.username
    }
