import json
import re
from typing import Dict, Any, Type, TypeVar
from pydantic import BaseModel, ValidationError as PydanticValidationError
from app.exceptions.ai_exceptions import InvalidAIResponseError

T = TypeVar("T", bound=BaseModel)


class ResponseParser:
    @staticmethod
    def clean_json_string(raw_text: str) -> str:
        """
        Removes markdown backticks, explanations, or trailing commas from LLM response.
        """
        text = raw_text.strip()
        # Remove ```json and ```
        text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.MULTILINE)
        text = re.sub(r"```\s*$", "", text, flags=re.MULTILINE)

        # Find first { or [ and last } or ]
        start_obj = text.find("{")
        start_arr = text.find("[")
        if start_obj != -1 and (start_arr == -1 or start_obj < start_arr):
            end_obj = text.rfind("}")
            if end_obj != -1:
                text = text[start_obj : end_obj + 1]
        elif start_arr != -1:
            end_arr = text.rfind("]")
            if end_arr != -1:
                text = text[start_arr : end_arr + 1]

        return text.strip()

    @classmethod
    def parse_and_validate(cls, raw_text: str, model_class: Type[T]) -> T:
        cleaned = cls.clean_json_string(raw_text)
        try:
            data = json.loads(cleaned)
        except json.JSONDecodeError as e:
            raise InvalidAIResponseError(f"Failed to parse AI output as JSON: {str(e)}")

        try:
            return model_class.model_validate(data)
        except PydanticValidationError as e:
            raise InvalidAIResponseError(f"AI response failed schema validation: {str(e)}")

    @classmethod
    def parse_dict(cls, raw_text: str) -> Dict[str, Any]:
        cleaned = cls.clean_json_string(raw_text)
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError as e:
            raise InvalidAIResponseError(f"Failed to decode AI response JSON: {str(e)}")
