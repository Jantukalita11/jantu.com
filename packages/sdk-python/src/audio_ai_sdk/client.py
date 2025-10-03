import os
import requests
from typing import Optional

class AudioAI:
    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None):
        self.api_key = api_key or os.getenv('AUDIOAI_API_KEY')
        self.base_url = (base_url or os.getenv('AUDIOAI_BASE_URL') or 'http://localhost:4000/v1').rstrip('/')

    def _headers(self):
        headers = { 'content-type': 'application/json' }
        if self.api_key:
            headers['authorization'] = f'Bearer {self.api_key}'
        return headers

    def tts_synthesize(self, payload: dict):
        r = requests.post(f"{self.base_url}/tts/synthesize", json=payload, headers=self._headers())
        r.raise_for_status()
        return r.json()

    def stt_transcribe(self, file_path: str):
        headers = { }
        if self.api_key:
            headers['authorization'] = f'Bearer {self.api_key}'
        with open(file_path, 'rb') as f:
            files = { 'file': (os.path.basename(file_path), f, 'application/octet-stream') }
            r = requests.post(f"{self.base_url}/stt/transcribe", files=files, headers=headers)
            r.raise_for_status()
            return r.json()
