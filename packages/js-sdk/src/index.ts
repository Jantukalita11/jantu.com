export interface ClientOptions { baseUrl?: string; apiKey: string; }

export class AudioAIClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(options: ClientOptions) {
    this.baseUrl = options.baseUrl ?? process.env.API_BASE_URL ?? "http://localhost:4000";
    this.apiKey = options.apiKey;
  }

  private async request(path: string, init: RequestInit = {}) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        "x-api-key": this.apiKey,
        "content-type": "application/json",
        ...(init.headers || {}),
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  tts(body: { text: string; voiceId: string; language?: string; speed?: number; pitch?: number; ssml?: string; format?: "mp3" | "wav" | "pcm" }) {
    return this.request("/v1/tts", { method: "POST", body: JSON.stringify(body) });
  }

  stt(body: { audioUrl: string; language?: string; diarize?: boolean }) {
    return this.request("/v1/stt", { method: "POST", body: JSON.stringify(body) });
  }

  getJob(jobId: string) {
    return this.request(`/v1/jobs/${jobId}`);
  }
}
