import { Job } from "bullmq";

export async function processStt(job: Job) {
  await new Promise((r) => setTimeout(r, 500));
  return { success: true, artifacts: { transcriptUrl: `s3://bucket/stt/${job.id}.json` } };
}
