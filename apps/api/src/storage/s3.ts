import AWS from 'aws-sdk';
import { env } from '../config/env';

const s3 = new AWS.S3({
  region: env.awsRegion,
  endpoint: env.s3Endpoint,
  s3ForcePathStyle: !!env.s3Endpoint,
  accessKeyId: env.s3AccessKey,
  secretAccessKey: env.s3SecretKey,
  signatureVersion: 'v4',
});

export function putObject(params: AWS.S3.PutObjectRequest) {
  return s3.putObject({ Bucket: env.s3Bucket!, ...params }).promise();
}

export function getSignedUrl(key: string, expiresInSeconds = 3600) {
  return s3.getSignedUrl('getObject', {
    Bucket: env.s3Bucket!,
    Key: key,
    Expires: expiresInSeconds,
  });
}
