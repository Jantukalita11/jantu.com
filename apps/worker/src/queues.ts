import { Worker, Queue, QueueEvents } from "bullmq";
import IORedis from "ioredis";
import { processTts } from "./processors/tts";
import { processStt } from "./processors/stt";

export const queueName = "audioai-jobs";

const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";
const connection = new IORedis(redisUrl);

export const queue = new Queue(queueName, { connection });
export const queueEvents = new QueueEvents(queueName, { connection });

export function startWorker() {
  const worker = new Worker(
    queueName,
    async (job) => {
      if (job.name === "tts") return processTts(job);
      if (job.name === "stt") return processStt(job);
      return { success: true };
    },
    { connection },
  );
  return worker;
}
