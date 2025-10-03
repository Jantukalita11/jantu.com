import { Queue, Worker, QueueEvents, JobsOptions } from 'bullmq';
import IORedis from 'ioredis';
import { env } from '../config/env';

const connection = new IORedis(env.redisUrl);

export const queues = {
  tts: new Queue('tts', { connection }),
  stt: new Queue('stt', { connection }),
  dubbing: new Queue('dubbing', { connection }),
  cloning: new Queue('cloning', { connection }),
};

export async function enqueue<K extends keyof typeof queues>(
  name: K,
  payload: unknown,
  options?: JobsOptions
) {
  return queues[name].add(name as string, payload as any, options);
}

// Example workers (no-op placeholder). In production run as separate processes.
new Worker(
  'tts',
  async (job) => {
    // Implement TTS generation by invoking model inference and S3 upload
    return { url: `s3://bucket/jobs/${job.id}.mp3` };
  },
  { connection }
);

new Worker(
  'stt',
  async () => {
    return { text: 'transcript' };
  },
  { connection }
);

export const queueEvents = new QueueEvents('tts', { connection });
