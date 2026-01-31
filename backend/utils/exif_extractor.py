"""EXIF data extraction utility for GPS coordinates from images."""
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
from typing import Optional, Tuple
import math

def extract_gps_from_image(image_path: str) -> Optional[Tuple[float, float]]:
    """
    Extract GPS coordinates from image EXIF data.
    
    Args:
        image_path: Path to the image file
        
    Returns:
        Tuple of (latitude, longitude) or None if no GPS data found
    """
    try:
        image = Image.open(image_path)
        exif_data = image._getexif()
        
        if not exif_data:
            return None
        
        # Get GPS info
        gps_info = {}
        for tag, value in exif_data.items():
            tag_name = TAGS.get(tag, tag)
            if tag_name == "GPSInfo":
                for gps_tag in value:
                    gps_tag_name = GPSTAGS.get(gps_tag, gps_tag)
                    gps_info[gps_tag_name] = value[gps_tag]
        
        if not gps_info:
            return None
        
        # Extract latitude and longitude
        lat = _convert_to_degrees(gps_info.get("GPSLatitude"))
        lon = _convert_to_degrees(gps_info.get("GPSLongitude"))
        
        if lat is None or lon is None:
            return None
        
        # Check for hemisphere
        if gps_info.get("GPSLatitudeRef") == "S":
            lat = -lat
        if gps_info.get("GPSLongitudeRef") == "W":
            lon = -lon
        
        return (lat, lon)
    
    except Exception as e:
        print(f"Error extracting GPS from image: {e}")
        return None

def _convert_to_degrees(value) -> Optional[float]:
    """
    Convert GPS coordinates to decimal degrees.
    
    Args:
        value: GPS coordinate value from EXIF
        
    Returns:
        Decimal degree value or None
    """
    if not value:
        return None
    
    try:
        d, m, s = value
        return float(d) + float(m) / 60.0 + float(s) / 3600.0
    except:
        return None

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points on Earth.
    
    Args:
        lat1, lon1: First point coordinates
        lat2, lon2: Second point coordinates
        
    Returns:
        Distance in meters
    """
    # Convert to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    # Earth radius in meters
    r = 6371000
    
    return c * r

def validate_geotag_location(
    image_lat: float,
    image_lon: float,
    current_lat: float,
    current_lon: float,
    threshold_meters: float = 100.0
) -> Tuple[bool, float]:
    """
    Verify if image geotag location matches current location.
    
    Args:
        image_lat, image_lon: GPS coordinates from image EXIF
        current_lat, current_lon: Current GPS coordinates
        threshold_meters: Maximum allowed distance in meters
        
    Returns:
        Tuple of (is_valid, distance_in_meters)
    """
    distance = haversine_distance(image_lat, image_lon, current_lat, current_lon)
    is_valid = distance <= threshold_meters
    
    return (is_valid, distance)

def add_gps_to_image(image_path: str, latitude: float, longitude: float) -> bool:
    """
    Add GPS coordinates to an image's EXIF data (for testing purposes).
    
    Args:
        image_path: Path to the image file
        latitude: Latitude to add
        longitude: Longitude to add
        
    Returns:
        True if successful, False otherwise
    """
    try:
        from PIL.ExifTags import GPS
        
        image = Image.open(image_path)
        exif_dict = image.getexif()
        
        # This is a simplified version - full implementation would require piexif library
        # For production, consider using piexif for proper GPS tag writing
        print(f"Warning: GPS writing not fully implemented. Use piexif library for production.")
        return False
    
    except Exception as e:
        print(f"Error adding GPS to image: {e}")
        return False
