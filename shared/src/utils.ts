import { PlanTier, PLAN_LIMITS } from './types';

export function calculateCreditsForTTS(text: string, voiceType: 'preset' | 'cloned'): number {
  const baseCredits = text.length;
  const multiplier = voiceType === 'cloned' ? 2 : 1;
  return Math.ceil(baseCredits * multiplier);
}

export function calculateCreditsForSTT(durationMinutes: number): number {
  return Math.ceil(durationMinutes * 100); // 100 credits per minute
}

export function calculateCreditsForVoiceCloning(type: 'instant' | 'professional'): number {
  return type === 'instant' ? 1000 : 5000;
}

export function calculateCreditsForDubbing(durationMinutes: number): number {
  return Math.ceil(durationMinutes * 500); // 500 credits per minute
}

export function getPlanLimits(planTier: PlanTier) {
  return PLAN_LIMITS[planTier];
}

export function canUserPerformAction(
  planTier: PlanTier,
  action: 'voice_clone' | 'dubbing' | 'project_create',
  currentUsage: { projects?: number; voiceClones?: number }
): boolean {
  const limits = getPlanLimits(planTier);
  
  switch (action) {
    case 'voice_clone':
      return limits.voiceClones === -1 || (currentUsage.voiceClones || 0) < limits.voiceClones;
    case 'project_create':
      return limits.projects === -1 || (currentUsage.projects || 0) < limits.projects;
    case 'dubbing':
      return ['creator', 'pro', 'scale', 'business', 'enterprise'].includes(planTier);
    default:
      return true;
  }
}

export function formatCredits(credits: number): string {
  if (credits >= 1000000) {
    return `${(credits / 1000000).toFixed(1)}M`;
  }
  if (credits >= 1000) {
    return `${(credits / 1000).toFixed(1)}k`;
  }
  return credits.toString();
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function validateAudioFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 100 * 1024 * 1024; // 100MB
  const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/m4a', 'audio/flac'];

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 100MB' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not supported. Please use MP3, WAV, M4A, or FLAC' };
  }

  return { valid: true };
}

export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 500 * 1024 * 1024; // 500MB
  const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv'];

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 500MB' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not supported. Please use MP4, MOV, AVI, or MKV' };
  }

  return { valid: true };
}

export function estimateReadingTime(text: string, wordsPerMinute: number = 150): number {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
}