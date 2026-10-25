from typing import Tuple, Dict

# Known coordinates fallback cache for common destinations
DESTINATION_COORDINATES: Dict[str, Tuple[float, float]] = {
    "paris": (48.8566, 2.3522),
    "tokyo": (35.6762, 139.6503),
    "new york": (40.7128, -74.0060),
    "rome": (41.9028, 12.4964),
    "london": (51.5074, -0.1278),
    "bali": (-8.4095, 115.1889),
    "barcelona": (41.3851, 2.1734),
    "sydney": (-33.8688, 151.2093),
    "dubai": (25.2048, 55.2708),
    "bangkok": (13.7563, 100.5018),
    "singapore": (1.3521, 103.8198),
    "amsterdam": (52.3676, 4.9041),
    "san francisco": (37.7749, -122.4194),
    "kyoto": (35.0116, 135.7681),
    "cairo": (30.0444, 31.2357),
    "cape town": (-33.9249, 18.4241),
    "rio de janeiro": (-22.9068, -43.1729),
}


def get_destination_coords(destination: str) -> Tuple[float, float]:
    key = destination.lower().strip()
    for city, coords in DESTINATION_COORDINATES.items():
        if city in key:
            return coords
    # Default to Paris coordinates if completely unknown
    return (48.8566, 2.3522)


def offset_coords(lat: float, lon: float, day_offset: int, item_offset: int) -> Tuple[float, float]:
    """
    Subtle offset for pins around a destination to prevent overlapping markers on map.
    """
    return (
        round(lat + (day_offset * 0.008) + (item_offset * 0.004), 5),
        round(lon + (day_offset * 0.006) - (item_offset * 0.005), 5),
    )
