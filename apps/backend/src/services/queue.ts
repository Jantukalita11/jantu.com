import Bull from 'bull';
import { config } from '../config';
import { logger } from '../utils/logger';

// Job queues
export const ttsQueue = new Bull('tts-generation', {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
  },
});

export const sttQueue = new Bull('speech-to-text', {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
  },
});

export const voiceCloneQueue = new Bull('voice-cloning', {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
  },
});

export const dubbingQueue = new Bull('dubbing', {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
  },
});

export const batchQueue = new Bull('batch-processing', {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
  },
});

// Queue event handlers
const setupQueueHandlers = (queue: Bull.Queue, queueName: string) => {
  queue.on('completed', (job) => {
    logger.info(`${queueName} job ${job.id} completed`);
  });

  queue.on('failed', (job, err) => {
    logger.error(`${queueName} job ${job.id} failed:`, err);
  });

  queue.on('error', (error) => {
    logger.error(`${queueName} queue error:`, error);
  });
};

setupQueueHandlers(ttsQueue, 'TTS');
setupQueueHandlers(sttQueue, 'STT');
setupQueueHandlers(voiceCloneQueue, 'Voice Clone');
setupQueueHandlers(dubbingQueue, 'Dubbing');
setupQueueHandlers(batchQueue, 'Batch');

// Export queue utilities
export const queueUtils = {
  async addJob(queueName: string, data: any, options?: Bull.JobOptions) {
    const queue = getQueue(queueName);
    return await queue.add(data, options);
  },

  async getJob(queueName: string, jobId: string) {
    const queue = getQueue(queueName);
    return await queue.getJob(jobId);
  },

  async getJobCounts(queueName: string) {
    const queue = getQueue(queueName);
    return await queue.getJobCounts();
  },
};

function getQueue(queueName: string): Bull.Queue {
  switch (queueName) {
    case 'tts':
      return ttsQueue;
    case 'stt':
      return sttQueue;
    case 'voice-clone':
      return voiceCloneQueue;
    case 'dubbing':
      return dubbingQueue;
    case 'batch':
      return batchQueue;
    default:
      throw new Error(`Unknown queue: ${queueName}`);
  }
}
