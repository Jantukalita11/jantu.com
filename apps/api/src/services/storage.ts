import { Client as MinioClient } from "minio";

const endPoint = process.env.S3_ENDPOINT?.replace(/^https?:\/\//, "") ?? "localhost:9000";
const [host, portStr] = endPoint.split(":");
const port = Number(portStr ?? 9000);
const useSSL = (process.env.S3_ENDPOINT ?? "http://").startsWith("https://");

export const s3 = new MinioClient({
  endPoint: host,
  port,
  useSSL,
  accessKey: process.env.S3_ACCESS_KEY_ID ?? "minio",
  secretKey: process.env.S3_SECRET_ACCESS_KEY ?? "minio123",
});

export async function ensureBucket(bucket: string) {
  const exists = await s3.bucketExists(bucket).catch(() => false);
  if (!exists) {
    await s3.makeBucket(bucket, process.env.S3_REGION ?? "us-east-1");
  }
}

export async function putObjectFromBuffer(
  bucket: string,
  objectName: string,
  buffer: Buffer,
  contentType: string,
) {
  await ensureBucket(bucket);
  await s3.putObject(bucket, objectName, buffer, { "Content-Type": contentType });
  return { bucket, objectName };
}

export function publicUrl(bucket: string, objectName: string) {
  const base = process.env.S3_ENDPOINT ?? "http://localhost:9000";
  return `${base}/${bucket}/${objectName}`;
}
