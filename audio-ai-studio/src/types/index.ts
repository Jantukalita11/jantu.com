// Core types for Audio AI Studio SaaS platform

export interface User {
  id: string
  email: string
  name?: string
  image?: string
  emailVerified?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Team {
  id: string
  name: string
  slug: string
  description?: string
  avatar?: string
  ownerId: string
  createdAt: Date
  updatedAt: Date
  owner: User
  memberships: TeamMembership[]
}

export interface TeamMembership {
  id: string
  userId: string
  teamId: string
  role: TeamRole
  joinedAt: Date
  user: User
  team: Team
}

export type TeamRole = 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER'

export interface Project {
  id: string
  name: string
  description?: string
  type: ProjectType
  status: ProjectStatus
  userId: string
  teamId?: string
  createdAt: Date
  updatedAt: Date
  user: User
  team?: Team
  tracks: AudioTrack[]
  jobs: Job[]
  exports: Export[]
}

export type ProjectType =
  | 'TTS'
  | 'STT'
  | 'VOICE_CLONE'
  | 'DUBBING'
  | 'CONVERSATIONAL_AI'

export type ProjectStatus =
  | 'DRAFT'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'ARCHIVED'

export interface AudioTrack {
  id: string
  projectId: string
  name: string
  content: string
  voiceId?: string
  order: number
  startTime?: number
  endTime?: number
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
  project: Project
}

export interface Job {
  id: string
  type: JobType
  status: JobStatus
  projectId: string
  userId: string
  teamId?: string
  inputData: Record<string, any>
  outputData?: Record<string, any>
  progress: number
  error?: string
  startedAt?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
  project: Project
  user: User
}

export type JobType =
  | 'TTS_GENERATE'
  | 'STT_TRANSCRIBE'
  | 'VOICE_CLONE_INSTANT'
  | 'VOICE_CLONE_PROFESSIONAL'
  | 'DUBBING_PROCESS'
  | 'CONVERSATIONAL_AI'
  | 'MUSIC_GENERATE'
  | 'EXPORT_AUDIO'

export type JobStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'

export interface VoiceClone {
  id: string
  name: string
  description?: string
  type: VoiceCloneType
  status: VoiceCloneStatus
  userId: string
  teamId?: string
  sampleUrls: string[]
  cloneUrl?: string
  settings?: Record<string, any>
  quality?: string
  createdAt: Date
  updatedAt: Date
  user: User
}

export type VoiceCloneType = 'INSTANT' | 'PROFESSIONAL'
export type VoiceCloneStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

export interface Export {
  id: string
  projectId: string
  format: string
  quality?: string
  url: string
  size?: number
  createdAt: Date
  project: Project
}

export interface Subscription {
  id: string
  userId: string
  teamId?: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  status: SubscriptionStatus
  tier: PricingTier
  creditsIncluded: number
  creditsUsed: number
  currentPeriodStart?: Date
  currentPeriodEnd?: Date
  cancelAtPeriodEnd: boolean
  createdAt: Date
  updatedAt: Date
  user: User
  team?: Team
}

export type SubscriptionStatus =
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'CANCELLED'
  | 'UNPAID'
  | 'INCOMPLETE'
  | 'TRIALING'

export type PricingTier =
  | 'FREE'
  | 'STARTER'
  | 'CREATOR'
  | 'PRO'
  | 'SCALE'
  | 'BUSINESS'
  | 'ENTERPRISE'

export interface UsageLog {
  id: string
  userId: string
  teamId?: string
  jobId?: string
  operation: string
  creditsUsed: number
  metadata?: Record<string, any>
  createdAt: Date
  user: User
}

export interface ApiKey {
  id: string
  name: string
  key: string
  userId: string
  teamId?: string
  permissions: string[]
  lastUsed?: Date
  expiresAt?: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  user: User
}

export interface Invoice {
  id: string
  userId: string
  teamId?: string
  stripeInvoiceId?: string
  amount: number
  currency: string
  status: InvoiceStatus
  invoicePdf?: string
  description?: string
  billingPeriodStart?: Date
  billingPeriodEnd?: Date
  createdAt: Date
  updatedAt: Date
  user: User
}

export type InvoiceStatus =
  | 'DRAFT'
  | 'OPEN'
  | 'PAID'
  | 'VOID'
  | 'UNCOLLECTIBLE'

export interface AuditLog {
  id: string
  userId?: string
  teamId?: string
  action: string
  resource: string
  resourceId?: string
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  createdAt: Date
  user?: User
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form types
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  name: string
}

export interface ProjectFormData {
  name: string
  description?: string
  type: ProjectType
}

export interface AudioTrackFormData {
  name: string
  content: string
  voiceId?: string
}

// TTS specific types
export interface TTSRequest {
  text: string
  voiceId: string
  language?: string
  speed?: number
  pitch?: number
  volume?: number
  format?: string
  sampleRate?: number
  bitrate?: number
}

export interface TTSSettings {
  voiceId: string
  language: string
  speed: number
  pitch: number
  volume: number
  format: string
  sampleRate: number
  bitrate: number
}

// STT specific types
export interface STTRequest {
  audioFile: File
  language?: string
  format?: string
  punctuate?: boolean
  diarize?: boolean
}

export interface STTResponse {
  text: string
  confidence: number
  segments?: TranscriptionSegment[]
  speakers?: SpeakerInfo[]
}

export interface TranscriptionSegment {
  id: number
  start: number
  end: number
  text: string
  confidence: number
  speaker?: string
}

export interface SpeakerInfo {
  speaker: string
  segments: number[]
}

// Voice cloning types
export interface VoiceCloneRequest {
  name: string
  description?: string
  type: VoiceCloneType
  sampleFiles: File[]
  settings?: Record<string, any>
}

// Authentication types
export interface AuthUser {
  id: string
  email: string
  name?: string
  image?: string
  role?: TeamRole
  teamId?: string
}

export interface Session {
  user: AuthUser
  expires: string
}

// Error types
export interface AppError {
  code: string
  message: string
  statusCode: number
  details?: Record<string, any>
}

// Credit system types
export interface CreditBalance {
  total: number
  used: number
  remaining: number
  resetDate?: Date
}

export interface CreditTransaction {
  id: string
  userId: string
  amount: number
  type: 'USAGE' | 'PURCHASE' | 'REFUND'
  operation: string
  metadata?: Record<string, any>
  createdAt: Date
}