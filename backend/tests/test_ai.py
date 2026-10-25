import pytest
from app.ai.response_parser import ResponseParser
from app.schemas.itinerary_schema import DayItinerarySchema
from app.exceptions.ai_exceptions import InvalidAIResponseError


def test_response_parser_markdown_stripping():
    raw_json_with_fences = """```json
    {
        "day_number": 1,
        "date": "2026-05-10",
        "summary": "First day in Barcelona exploring Gothic Quarter",
        "activities": [],
        "food_recommendations": [],
        "transportation": [],
        "estimated_daily_cost": 75.0
    }
    ```"""
    parsed = ResponseParser.parse_and_validate(raw_json_with_fences, DayItinerarySchema)
    assert parsed.day_number == 1
    assert parsed.estimated_daily_cost == 75.0


def test_response_parser_malformed_json():
    broken = "This is not json at all."
    with pytest.raises(InvalidAIResponseError):
        ResponseParser.parse_and_validate(broken, DayItinerarySchema)
