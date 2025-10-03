export type Env = {
  port: number;
  databaseUrl: string;
  redisUrl: string;
  awsRegion?: string;
  s3Endpoint?: string;
  s3Bucket?: string;
  s3AccessKey?: string;
  s3SecretKey?: string;
  jwtSecret: string;
  ffmpegPath?: string;
  stripeSecret?: string;
  stripeWebhookSecret?: string;
};

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Missing env var ${name}`);
  return value;
}

export const env: Env = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: requireEnv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/audio_ai?schema=public'),
  redisUrl: requireEnv('REDIS_URL', 'redis://localhost:6379'),
  awsRegion: process.env.AWS_REGION,
  s3Endpoint: process.env.S3_ENDPOINT,
  s3Bucket: process.env.S3_BUCKET,
  s3AccessKey: process.env.S3_ACCESS_KEY,
  s3SecretKey: process.env.S3_SECRET_KEY,
  jwtSecret: requireEnv('JWT_SECRET', 'dev'),
  ffmpegPath: process.env.FFMPEG_PATH,
  stripeSecret: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
};
