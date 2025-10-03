export const config = {
  port: Number(process.env.API_PORT ?? 4000),
  host: process.env.API_HOST ?? "0.0.0.0",
  redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
  s3: {
    endpoint: process.env.S3_ENDPOINT ?? "http://localhost:9000",
    region: process.env.S3_REGION ?? "us-east-1",
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "minio",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "minio123",
    publicBucket: process.env.S3_PUBLIC_BUCKET ?? "audioai-public",
    privateBucket: process.env.S3_PRIVATE_BUCKET ?? "audioai-private",
  },
};
