import re
from datetime import datetime
from app.exceptions.base_exception import ValidationError


def validate_date_range(start_date: str, end_date: str):
    try:
        s = datetime.strptime(start_date, "%Y-%m-%d").date()
        e = datetime.strptime(end_date, "%Y-%m-%d").date()
    except ValueError:
        raise ValidationError("Dates must be in YYYY-MM-DD format")

    if e < s:
        raise ValidationError("End date cannot be earlier than start date")

    days = (e - s).days + 1
    if days > 30:
        raise ValidationError("Trip duration cannot exceed 30 days per itinerary")
    return days


def sanitize_input(text: str) -> str:
    if not text:
        return ""
    # Strip HTML tags
    cleaned = re.sub(r"<[^>]*>", "", text)
    return cleaned.strip()
