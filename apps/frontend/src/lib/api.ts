import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          const refreshed = await this.refreshToken();
          if (refreshed) {
            // Retry original request
            return this.client(error.config);
          }
          // Redirect to login
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) return false;

      const response = await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken,
      });

      this.setToken(response.data.token);
      localStorage.setItem('refresh_token', response.data.refreshToken);
      return true;
    } catch {
      return false;
    }
  }

  // Auth endpoints
  async signup(email: string, password: string, name?: string) {
    const response = await this.client.post('/auth/signup', { email, password, name });
    this.setToken(response.data.token);
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    if (response.data.token) {
      this.setToken(response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('refresh_token', response.data.refreshToken);
      }
    }
    return response.data;
  }

  async logout() {
    await this.client.post('/auth/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  // User endpoints
  async getCurrentUser() {
    const response = await this.client.get('/users/me');
    return response.data;
  }

  async updateProfile(data: any) {
    const response = await this.client.patch('/users/me', data);
    return response.data;
  }

  // TTS endpoints
  async generateSpeech(data: {
    text: string;
    voice_id: string;
    language?: string;
    settings?: any;
  }) {
    const response = await this.client.post('/tts/generate', data);
    return response.data;
  }

  async getVoices() {
    const response = await this.client.get('/tts/voices');
    return response.data;
  }

  // Projects endpoints
  async getProjects() {
    const response = await this.client.get('/projects');
    return response.data;
  }

  async createProject(data: any) {
    const response = await this.client.post('/projects', data);
    return response.data;
  }

  async getProject(id: string) {
    const response = await this.client.get(`/projects/${id}`);
    return response.data;
  }

  async updateProject(id: string, data: any) {
    const response = await this.client.patch(`/projects/${id}`, data);
    return response.data;
  }

  async deleteProject(id: string) {
    const response = await this.client.delete(`/projects/${id}`);
    return response.data;
  }

  // Voice cloning endpoints
  async getVoiceClones() {
    const response = await this.client.get('/voice-clones');
    return response.data;
  }

  async createVoiceClone(data: any) {
    const response = await this.client.post('/voice-clones', data);
    return response.data;
  }

  // Transcription endpoints
  async transcribeAudio(data: any) {
    const response = await this.client.post('/stt/transcribe', data);
    return response.data;
  }

  // Subscription endpoints
  async getCurrentSubscription() {
    const response = await this.client.get('/subscriptions/current');
    return response.data;
  }

  async upgradePlan(plan: string) {
    const response = await this.client.post('/subscriptions/upgrade', { plan });
    return response.data;
  }

  // Usage endpoints
  async getUsage() {
    const response = await this.client.get('/users/me/usage');
    return response.data;
  }
}

export const api = new ApiClient();
