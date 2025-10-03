import { PricingTier } from '@prisma/client'

export interface PricingPlan {
  tier: PricingTier
  name: string
  price: number
  credits: number
  features: string[]
  popular?: boolean
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    tier: PricingTier.FREE,
    name: 'Free',
    price: 0,
    credits: 10000,
    features: [
      '10k credits/month',
      'Text-to-Speech',
      'Speech-to-Text',
      'Studio access (limited)',
      'Conversational AI trial',
      'API access with low concurrency',
      'Basic onboarding'
    ]
  },
  {
    tier: PricingTier.STARTER,
    name: 'Starter',
    price: 5,
    credits: 30000,
    features: [
      'Everything in Free',
      'Commercial license',
      'Instant voice cloning',
      'Dubbing Studio',
      '20 Studio projects',
      'Music use for social/ads'
    ]
  },
  {
    tier: PricingTier.CREATOR,
    name: 'Creator',
    price: 11,
    credits: 100000,
    features: [
      'Everything in Starter',
      'Professional voice cloning',
      'Usage-based billing for extra credits',
      'Higher-quality audio (192 kbps)'
    ]
  },
  {
    tier: PricingTier.PRO,
    name: 'Pro',
    price: 99,
    credits: 500000,
    features: [
      'Everything in Creator',
      '44.1kHz PCM API output',
      'Higher concurrency',
      'Advanced export options',
      'Priority email support'
    ]
  },
  {
    tier: PricingTier.SCALE,
    name: 'Scale',
    price: 330,
    credits: 2000000,
    features: [
      'Everything in Pro',
      'Multi-seat workspace (3 seats)',
      'Team admin controls',
      'Elevated concurrency'
    ]
  },
  {
    tier: PricingTier.BUSINESS,
    name: 'Business',
    price: 1320,
    credits: 11000000,
    features: [
      'Everything in Scale',
      'Multi-seat workspace (5 seats)',
      'Low-latency TTS pricing',
      '3 professional voice clones',
      'Dedicated support SLA'
    ]
  }
]

export const ENTERPRISE_FEATURES = [
  'Custom credits & seats',
  'Custom DPA/SLAs',
  'BAAs for HIPAA',
  'Custom SSO',
  'Elevated concurrency',
  'Managed dubbing',
  'Priority support'
]

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti' }
]

export const VOICE_TYPES = [
  { id: 'alloy', name: 'Alloy', gender: 'neutral', language: 'en', description: 'Balanced and versatile' },
  { id: 'echo', name: 'Echo', gender: 'male', language: 'en', description: 'Deep and resonant' },
  { id: 'fable', name: 'Fable', gender: 'female', language: 'en', description: 'Warm and expressive' },
  { id: 'onyx', name: 'Onyx', gender: 'male', language: 'en', description: 'Authoritative and clear' },
  { id: 'nova', name: 'Nova', gender: 'female', language: 'en', description: 'Bright and energetic' },
  { id: 'shimmer', name: 'Shimmer', gender: 'female', language: 'en', description: 'Soft and gentle' }
]

export const AUDIO_FORMATS = [
  { value: 'mp3', label: 'MP3', extension: '.mp3' },
  { value: 'wav', label: 'WAV', extension: '.wav' },
  { value: 'ogg', label: 'OGG', extension: '.ogg' },
  { value: 'flac', label: 'FLAC', extension: '.flac' }
]

export const SAMPLE_RATES = [
  { value: 16000, label: '16kHz' },
  { value: 22050, label: '22.05kHz' },
  { value: 44100, label: '44.1kHz' },
  { value: 48000, label: '48kHz' }
]

export const BITRATES = [
  { value: 64, label: '64 kbps' },
  { value: 128, label: '128 kbps' },
  { value: 192, label: '192 kbps' },
  { value: 320, label: '320 kbps' }
]