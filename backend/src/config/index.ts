export const config = {
  // Application
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  apiUrl: process.env.API_URL || 'http://localhost:3001',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Database
  databaseUrl: process.env.DATABASE_URL || 'postgresql://localhost:5432/audio_ai_studio',

  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // OAuth
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },
  },

  // AWS
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.AWS_S3_BUCKET || 'audio-ai-studio-assets',
  },

  // Stripe
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
  },

  // Email
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.FROM_EMAIL || 'noreply@audioaistudio.com',
    fromName: process.env.FROM_NAME || 'Audio AI Studio',
  },

  // AI Services
  ai: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
    },
    elevenlabs: {
      apiKey: process.env.ELEVENLABS_API_KEY || '',
    },
    azure: {
      speechKey: process.env.AZURE_SPEECH_KEY || '',
      speechRegion: process.env.AZURE_SPEECH_REGION || 'eastus',
    },
  },

  // Monitoring
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // File Upload
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '104857600', 10), // 100MB
    allowedAudioTypes: process.env.ALLOWED_AUDIO_TYPES?.split(',') || [
      'audio/mpeg',
      'audio/wav',
      'audio/mp4',
      'audio/m4a',
      'audio/flac',
    ],
    allowedVideoTypes: process.env.ALLOWED_VIDEO_TYPES?.split(',') || [
      'video/mp4',
      'video/mov',
      'video/avi',
      'video/mkv',
    ],
  },

  // Credits and Pricing
  credits: {
    ttsPerCharacter: 1,
    ttsClonedMultiplier: 2,
    sttPerMinute: 100,
    voiceCloningInstant: 1000,
    voiceCloningProfessional: 5000,
    dubbingPerMinute: 500,
  },

  // Plan Limits
  planLimits: {
    free: {
      credits: 10000,
      projects: 3,
      voiceClones: 0,
      teamSeats: 1,
      apiConcurrency: 1,
    },
    starter: {
      credits: 30000,
      projects: 20,
      voiceClones: 1,
      teamSeats: 1,
      apiConcurrency: 2,
    },
    creator: {
      credits: 100000,
      projects: 50,
      voiceClones: 3,
      teamSeats: 1,
      apiConcurrency: 5,
    },
    pro: {
      credits: 500000,
      projects: 100,
      voiceClones: 10,
      teamSeats: 1,
      apiConcurrency: 10,
    },
    scale: {
      credits: 2000000,
      projects: 200,
      voiceClones: 25,
      teamSeats: 3,
      apiConcurrency: 20,
    },
    business: {
      credits: 11000000,
      projects: 500,
      voiceClones: 100,
      teamSeats: 5,
      apiConcurrency: 50,
    },
    enterprise: {
      credits: -1, // unlimited
      projects: -1,
      voiceClones: -1,
      teamSeats: -1,
      apiConcurrency: 100,
    },
  },
} as const;