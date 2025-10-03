export type SdkOptions = { apiKey?: string; baseUrl?: string };

export class AudioAI {
  private apiKey?: string;
  private baseUrl: string;

  constructor(options: SdkOptions = {}) {
    this.apiKey = options.apiKey ?? process.env.AUDIOAI_API_KEY;
    this.baseUrl = (options.baseUrl ?? process.env.AUDIOAI_BASE_URL ?? 'http://localhost:4000/v1').replace(/\/$/, '');
  }

  private headers(): Record<string, string> {
    const headers: Record<string, string> = { 'content-type': 'application/json' };
    if (this.apiKey) headers['authorization'] = `Bearer ${this.apiKey}`;
    return headers;
  }

  public tts = {
    synthesize: async (input: { text: string; voiceId?: string; language?: string; speed?: number; pitch?: number; format?: 'mp3' | 'wav' }) => {
      const res = await fetch(`${this.baseUrl}/tts/synthesize`, {
        method: 'POST', headers: this.headers(), body: JSON.stringify(input)
      });
      if (!res.ok) throw new Error(`TTS failed: ${res.status}`);
      return res.json();
    }
  };

  public stt = {
    transcribe: async (file: Blob | Buffer, filename = 'audio.wav') => {
      const form = new FormData();
      form.append('file', file as any, filename);
      const res = await fetch(`${this.baseUrl}/stt/transcribe`, { method: 'POST', body: form as any, headers: this.apiKey ? { authorization: `Bearer ${this.apiKey}` } : undefined });
      if (!res.ok) throw new Error(`STT failed: ${res.status}`);
      return res.json();
    }
  };
}
