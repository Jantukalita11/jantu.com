import { Queue, QueueEvents, JobsOptions, Job } from "bullmq";
import IORedis from "ioredis";

export const queueName = "audioai-jobs";

const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";
const connection = new IORedis(redisUrl);

export const queue = new Queue(queueName, { connection });
export const queueEvents = new QueueEvents(queueName, { connection });

export interface TtsJobPayload {
  type: "tts";
  text: string;
  voiceId: string;
  language?: string;
  speed?: number; // 0.5 - 2.0
  pitch?: number; // -12 to +12 semitones
  prosody?: Record<string, unknown>;
  ssml?: string;
  format?: "mp3" | "wav" | "pcm";
  projectId?: string;
}

export interface SttJobPayload {
  type: "stt";
  audioUrl?: string;
  uploadKey?: string;
  language?: string;
  diarize?: boolean;
}

export interface GenericJobResult {
  success: boolean;
  artifacts?: {
    audioUrl?: string;
    transcriptUrl?: string;
  };
  details?: Record<string, unknown>;
}

const defaultJobOptions: JobsOptions = {
  attempts: 3,
  backoff: { type: "exponential", delay: 2000 },
  removeOnComplete: { age: 24 * 3600 },
  removeOnFail: { age: 7 * 24 * 3600 },
};

export async function enqueueTts(payload: Omit<TtsJobPayload, "type">) {
  const job = await queue.add("tts", { type: "tts", ...payload }, defaultJobOptions);
  return job;
}

export async function enqueueStt(payload: Omit<SttJobPayload, "type">) {
  const job = await queue.add("stt", { type: "stt", ...payload }, defaultJobOptions);
  return job;
}

export async function getJob(jobId: string): Promise<Job | null> {
  return queue.getJob(jobId);
}
