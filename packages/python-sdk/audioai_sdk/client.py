import os
import requests

class AudioAIClient:
    def __init__(self, api_key: str, base_url: str | None = None):
        self.base_url = base_url or os.environ.get("API_BASE_URL", "http://localhost:4000")
        self.api_key = api_key

    def _request(self, path: str, method: str = "GET", json=None):
        resp = requests.request(method, f"{self.base_url}{path}", json=json, headers={
            "x-api-key": self.api_key,
            "content-type": "application/json"
        })
        resp.raise_for_status()
        return resp.json()

    def tts(self, **kwargs):
        return self._request("/v1/tts", method="POST", json=kwargs)

    def stt(self, **kwargs):
        return self._request("/v1/stt", method="POST", json=kwargs)

    def get_job(self, job_id: str):
        return self._request(f"/v1/jobs/{job_id}")
