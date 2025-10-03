import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  apiVersion: process.env.API_VERSION || 'v1',

  // Database
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'audio_ai_studio',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    url: process.env.DATABASE_URL,
    pool: {
      min: parseInt(process.env.DB_POOL_MIN || '2', 10),
      max: parseInt(process.env.DB_POOL_MAX || '10', 10),
    },
  },

  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    url: process.env.REDIS_URL,
  },

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',

  // OAuth
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackUrl: process.env.GITHUB_CALLBACK_URL,
  },

  // Stripe
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    prices: {
      free: process.env.STRIPE_PRICE_FREE || '',
      starter: process.env.STRIPE_PRICE_STARTER || '',
      creator: process.env.STRIPE_PRICE_CREATOR || '',
      pro: process.env.STRIPE_PRICE_PRO || '',
      scale: process.env.STRIPE_PRICE_SCALE || '',
      business: process.env.STRIPE_PRICE_BUSINESS || '',
    },
  },

  // AWS
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: process.env.S3_BUCKET || 'audio-ai-studio-assets',
  },

  // Email
  email: {
    from: process.env.EMAIL_FROM || 'noreply@audioaistudio.com',
    sendgridApiKey: process.env.SENDGRID_API_KEY,
  },

  // AI Model Endpoints
  aiEndpoints: {
    tts: process.env.TTS_MODEL_ENDPOINT || 'http://tts-inference:8000',
    stt: process.env.STT_MODEL_ENDPOINT || 'http://stt-inference:8000',
    voiceClone: process.env.VOICE_CLONE_ENDPOINT || 'http://voice-clone:8000',
    dubbing: process.env.DUBBING_ENDPOINT || 'http://dubbing:8000',
  },

  // Rate Limiting
  rateLimit: {
    window: process.env.RATE_LIMIT_WINDOW || '15m',
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    premiumMax: parseInt(process.env.RATE_LIMIT_PREMIUM_MAX || '1000', 10),
  },

  // Security
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  webhookSecret: process.env.WEBHOOK_SECRET || 'webhook-secret',

  // Feature Flags
  features: {
    mfa: process.env.ENABLE_MFA === 'true',
    voiceCloning: process.env.ENABLE_VOICE_CLONING === 'true',
    dubbing: process.env.ENABLE_DUBBING === 'true',
    stt: process.env.ENABLE_STT === 'true',
    conversationalAi: process.env.ENABLE_CONVERSATIONAL_AI === 'true',
  },
};
