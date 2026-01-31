"""Location verification utilities using Haversine formula."""
import math
from typing import Tuple, Optional, List
from config import ALLOWED_LOCATIONS

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points on Earth.
    Uses the Haversine formula.
    
    Args:
        lat1, lon1: Latitude and longitude of first point (in degrees)
        lat2, lon2: Latitude and longitude of second point (in degrees)
        
    Returns:
        Distance in meters
    """
    # Earth's radius in meters
    R = 6371000
    
    # Convert degrees to radians
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    # Haversine formula
    a = (math.sin(delta_lat / 2) ** 2 +
         math.cos(lat1_rad) * math.cos(lat2_rad) *
         math.sin(delta_lon / 2) ** 2)
    
    c = 2 * math.asin(math.sqrt(a))
    
    distance = R * c
    
    return distance

def verify_location(latitude: float, longitude: float, 
                   allowed_locations: Optional[List[dict]] = None) -> Tuple[bool, Optional[str], Optional[float]]:
    """
    Verify if the given location is within any allowed geofence.
    
    Args:
        latitude: User's latitude
        longitude: User's longitude
        allowed_locations: List of allowed location dicts (optional, uses config default)
        
    Returns:
        Tuple of (is_valid, location_name, distance_from_center)
    """
    if allowed_locations is None:
        allowed_locations = ALLOWED_LOCATIONS
    
    if not allowed_locations:
        # If no locations configured, allow all
        return (True, "No restrictions", 0.0)
    
    for location in allowed_locations:
        distance = haversine_distance(
            latitude, longitude,
            location['latitude'], location['longitude']
        )
        
        if distance <= location['radius_meters']:
            return (True, location['name'], distance)
    
    # Find nearest location for error message
    nearest_location = min(
        allowed_locations,
        key=lambda loc: haversine_distance(
            latitude, longitude,
            loc['latitude'], loc['longitude']
        )
    )
    
    nearest_distance = haversine_distance(
        latitude, longitude,
        nearest_location['latitude'], nearest_location['longitude']
    )
    
    return (False, nearest_location['name'], nearest_distance)

def get_location_info(latitude: float, longitude: float) -> dict:
    """
    Get detailed location verification information.
    
    Args:
        latitude: User's latitude
        longitude: User's longitude
        
    Returns:
        Dictionary with verification details
    """
    is_valid, location_name, distance = verify_location(latitude, longitude)
    
    return {
        "is_valid": is_valid,
        "location_name": location_name,
        "distance_meters": round(distance, 2),
        "latitude": latitude,
        "longitude": longitude
    }

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate distance between two coordinates.
    Alias for haversine_distance for convenience.
    
    Returns:
        Distance in meters
    """
    return haversine_distance(lat1, lon1, lat2, lon2)
