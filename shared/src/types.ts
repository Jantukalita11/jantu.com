import { z } from 'zod';

// User and Authentication Types
export const UserRoleSchema = z.enum(['owner', 'admin', 'editor', 'viewer']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  avatar: z.string().url().optional(),
  role: UserRoleSchema,
  teamId: z.string().uuid().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type User = z.infer<typeof UserSchema>;

// Subscription and Billing Types
export const PlanTierSchema = z.enum(['free', 'starter', 'creator', 'pro', 'scale', 'business', 'enterprise']);
export type PlanTier = z.infer<typeof PlanTierSchema>;

export const SubscriptionSchema = z.object({
  id: z.string(),
  userId: z.string().uuid(),
  planTier: PlanTierSchema,
  status: z.enum(['active', 'canceled', 'past_due', 'trialing']),
  currentPeriodStart: z.date(),
  currentPeriodEnd: z.date(),
  creditsIncluded: z.number(),
  creditsUsed: z.number(),
  stripeSubscriptionId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Subscription = z.infer<typeof SubscriptionSchema>;

// Voice and Audio Types
export const VoiceTypeSchema = z.enum(['preset', 'cloned_instant', 'cloned_professional']);
export type VoiceType = z.infer<typeof VoiceTypeSchema>;

export const VoiceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: VoiceTypeSchema,
  language: z.string(),
  gender: z.enum(['male', 'female', 'neutral']),
  ageRange: z.enum(['child', 'young_adult', 'adult', 'elderly']),
  accent: z.string().optional(),
  description: z.string().optional(),
  previewUrl: z.string().url().optional(),
  isPublic: z.boolean(),
  userId: z.string().uuid().optional(),
  modelPath: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Voice = z.infer<typeof VoiceSchema>;

// Project and Studio Types
export const ProjectTypeSchema = z.enum(['tts', 'dubbing', 'conversation', 'music']);
export type ProjectType = z.infer<typeof ProjectTypeSchema>;

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: ProjectTypeSchema,
  description: z.string().optional(),
  userId: z.string().uuid(),
  teamId: z.string().uuid().optional(),
  settings: z.record(z.any()),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Project = z.infer<typeof ProjectSchema>;

// Audio Job Types
export const JobTypeSchema = z.enum(['tts', 'stt', 'voice_clone', 'dubbing', 'music_generation']);
export type JobType = z.infer<typeof JobTypeSchema>;

export const JobStatusSchema = z.enum(['pending', 'processing', 'completed', 'failed']);
export type JobStatus = z.infer<typeof JobStatusSchema>;

export const AudioJobSchema = z.object({
  id: z.string().uuid(),
  type: JobTypeSchema,
  status: JobStatusSchema,
  userId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  inputData: z.record(z.any()),
  outputData: z.record(z.any()).optional(),
  creditsUsed: z.number(),
  errorMessage: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  completedAt: z.date().optional(),
});
export type AudioJob = z.infer<typeof AudioJobSchema>;

// TTS Request Types
export const TTSRequestSchema = z.object({
  text: z.string().min(1).max(10000),
  voiceId: z.string().uuid(),
  speed: z.number().min(0.25).max(4.0).default(1.0),
  pitch: z.number().min(-20).max(20).default(0),
  stability: z.number().min(0).max(1).default(0.75),
  similarityBoost: z.number().min(0).max(1).default(0.75),
  style: z.number().min(0).max(1).default(0),
  useSpeakerBoost: z.boolean().default(true),
  outputFormat: z.enum(['mp3', 'wav', 'pcm']).default('mp3'),
  sampleRate: z.number().optional(),
});
export type TTSRequest = z.infer<typeof TTSRequestSchema>;

// STT Request Types
export const STTRequestSchema = z.object({
  audioUrl: z.string().url(),
  language: z.string().optional(),
  enableDiarization: z.boolean().default(false),
  enablePunctuation: z.boolean().default(true),
  enableTimestamps: z.boolean().default(true),
  outputFormat: z.enum(['json', 'srt', 'vtt', 'txt']).default('json'),
});
export type STTRequest = z.infer<typeof STTRequestSchema>;

// Voice Cloning Types
export const VoiceCloningRequestSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  audioFiles: z.array(z.string().url()).min(1).max(25),
  type: z.enum(['instant', 'professional']),
  language: z.string(),
});
export type VoiceCloningRequest = z.infer<typeof VoiceCloningRequestSchema>;

// API Response Types
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

// Pagination Types
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  total: z.number().optional(),
  totalPages: z.number().optional(),
});
export type Pagination = z.infer<typeof PaginationSchema>;

// Usage and Analytics Types
export const UsageMetricSchema = z.object({
  userId: z.string().uuid(),
  date: z.date(),
  creditsUsed: z.number(),
  ttsCharacters: z.number(),
  sttMinutes: z.number(),
  voiceCloningJobs: z.number(),
  dubbingMinutes: z.number(),
});
export type UsageMetric = z.infer<typeof UsageMetricSchema>;

// Constants
export const PLAN_LIMITS = {
  free: { credits: 10000, projects: 3, voiceClones: 0, teamSeats: 1 },
  starter: { credits: 30000, projects: 20, voiceClones: 1, teamSeats: 1 },
  creator: { credits: 100000, projects: 50, voiceClones: 3, teamSeats: 1 },
  pro: { credits: 500000, projects: 100, voiceClones: 10, teamSeats: 1 },
  scale: { credits: 2000000, projects: 200, voiceClones: 25, teamSeats: 3 },
  business: { credits: 11000000, projects: 500, voiceClones: 100, teamSeats: 5 },
  enterprise: { credits: -1, projects: -1, voiceClones: -1, teamSeats: -1 }, // unlimited
} as const;

export const SUPPORTED_LANGUAGES = [
  'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh',
  'ar', 'hi', 'tr', 'pl', 'nl', 'sv', 'da', 'no', 'fi', 'cs',
  'hu', 'ro', 'bg', 'hr', 'sk', 'sl', 'et', 'lv', 'lt', 'mt',
  'el', 'cy'
] as const;

export const AUDIO_FORMATS = ['mp3', 'wav', 'pcm'] as const;
export const SAMPLE_RATES = [8000, 16000, 22050, 44100, 48000] as const;