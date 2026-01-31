"""File storage utilities for images and data."""
from pathlib import Path
from datetime import datetime
from typing import Tuple
import shutil
from config import PROFILE_IMAGES_DIR, ATTENDANCE_SNAPSHOTS_DIR

def save_profile_image(student_id: int, image_data: bytes, extension: str = "jpg") -> str:
    """
    Save student profile image to local storage.
    
    Args:
        student_id: Student ID
        image_data: Image bytes
        extension: File extension (default: jpg)
        
    Returns:
        Path to saved image
    """
    filename = f"student_{student_id}.{extension}"
    file_path = PROFILE_IMAGES_DIR / filename
    
    with open(file_path, 'wb') as f:
        f.write(image_data)
    
    return str(file_path)

def save_multiple_profile_images(student_id: int, images_data: list, extensions: list) -> list:
    """
    Save multiple profile images for a student.
    
    Args:
        student_id: Student ID
        images_data: List of image bytes
        extensions: List of extensions for each image
        
    Returns:
        List of paths to saved images
    """
    saved_paths = []
    for i, (image_data, extension) in enumerate(zip(images_data, extensions)):
        filename = f"student_{student_id}_image_{i}.{extension}"
        file_path = PROFILE_IMAGES_DIR / filename
        
        with open(file_path, 'wb') as f:
            f.write(image_data)
        
        saved_paths.append(str(file_path))
    
    return saved_paths

def save_attendance_snapshot(student_id: int, image_data: bytes, 
                            timestamp: datetime = None, extension: str = "jpg") -> str:
    """
    Save attendance verification snapshot to local storage.
    
    Args:
        student_id: Student ID
        image_data: Image bytes
        timestamp: Timestamp for filename (default: current time)
        extension: File extension (default: jpg)
        
    Returns:
        Path to saved snapshot
    """
    if timestamp is None:
        timestamp = datetime.utcnow()
    
    # Format: student_123_20260124_160530.jpg
    timestamp_str = timestamp.strftime("%Y%m%d_%H%M%S")
    filename = f"student_{student_id}_{timestamp_str}.{extension}"
    file_path = ATTENDANCE_SNAPSHOTS_DIR / filename
    
    with open(file_path, 'wb') as f:
        f.write(image_data)
    
    return str(file_path)

def get_image_extension(filename: str) -> str:
    """
    Extract file extension from filename.
    
    Args:
        filename: Original filename
        
    Returns:
        Extension without dot (e.g., 'jpg', 'png')
    """
    return Path(filename).suffix.lstrip('.').lower() or 'jpg'

def ensure_directories_exist():
    """Ensure all required directories exist."""
    PROFILE_IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    ATTENDANCE_SNAPSHOTS_DIR.mkdir(parents=True, exist_ok=True)

def delete_student_files(student_id: int):
    """
    Delete all files associated with a student.
    
    Args:
        student_id: Student ID
    """
    # Delete profile image
    profile_pattern = f"student_{student_id}.*"
    for file_path in PROFILE_IMAGES_DIR.glob(profile_pattern):
        file_path.unlink(missing_ok=True)
    
    # Delete attendance snapshots
    snapshot_pattern = f"student_{student_id}_*.*"
    for file_path in ATTENDANCE_SNAPSHOTS_DIR.glob(snapshot_pattern):
        file_path.unlink(missing_ok=True)
