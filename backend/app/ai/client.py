import logging
import httpx
from typing import Optional
from app.config.settings import get_settings
from app.exceptions.ai_exceptions import AIServiceError, AITimeoutError

logger = logging.getLogger("wanderai.ai.client")


class AIClient:
    def __init__(self):
        self.settings = get_settings()

    async def generate_completion(self, system_prompt: str, user_prompt: str) -> str:
        provider = (self.settings.AI_PROVIDER or "mock").lower()
        api_key = self.settings.AI_API_KEY

        if not api_key or provider == "mock":
            logger.info("Using embedded intelligent travel generator engine (No external API key set)")
            return ""

        try:
            if provider == "openai":
                return await self._call_openai(system_prompt, user_prompt)
            elif provider == "anthropic":
                return await self._call_anthropic(system_prompt, user_prompt)
            elif provider == "gemini":
                return await self._call_gemini(system_prompt, user_prompt)
            else:
                logger.warning(f"Unsupported AI provider '{provider}', falling back to intelligent generator")
                return ""
        except httpx.TimeoutException:
            raise AITimeoutError("AI service request timed out after configured deadline")
        except Exception as e:
            logger.error(f"Error calling {provider} API: {str(e)}")
            raise AIServiceError(f"External AI Provider error: {str(e)}")

    async def _call_openai(self, system_prompt: str, user_prompt: str) -> str:
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.settings.AI_API_KEY}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.settings.AI_MODEL or "gpt-4o",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.7,
        }
        async with httpx.AsyncClient(timeout=self.settings.AI_TIMEOUT_SECONDS) as client:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code != 200:
                raise AIServiceError(f"OpenAI error {resp.status_code}: {resp.text}")
            data = resp.json()
            return data["choices"][0]["message"]["content"]

    async def _call_anthropic(self, system_prompt: str, user_prompt: str) -> str:
        url = "https://api.anthropic.com/v1/messages"
        headers = {
            "x-api-key": self.settings.AI_API_KEY,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.settings.AI_MODEL or "claude-3-5-sonnet-20241022",
            "max_tokens": 4096,
            "system": system_prompt,
            "messages": [{"role": "user", "content": user_prompt}],
            "temperature": 0.7,
        }
        async with httpx.AsyncClient(timeout=self.settings.AI_TIMEOUT_SECONDS) as client:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code != 200:
                raise AIServiceError(f"Anthropic error {resp.status_code}: {resp.text}")
            data = resp.json()
            return data["content"][0]["text"]

    async def _call_gemini(self, system_prompt: str, user_prompt: str) -> str:
        model = self.settings.AI_MODEL or "gemini-1.5-flash"
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={self.settings.AI_API_KEY}"
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": f"System Instructions: {system_prompt}\n\nTask: {user_prompt}"}
                    ]
                }
            ],
            "generationConfig": {
                "response_mime_type": "application/json",
                "temperature": 0.7,
            },
        }
        async with httpx.AsyncClient(timeout=self.settings.AI_TIMEOUT_SECONDS) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code != 200:
                raise AIServiceError(f"Gemini error {resp.status_code}: {resp.text}")
            data = resp.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]


ai_client = AIClient()
