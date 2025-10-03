import { Job } from "bullmq";

export async function processTts(job: Job) {
  await new Promise((r) => setTimeout(r, 500));
  return { success: true, artifacts: { audioUrl: `s3://bucket/tts/${job.id}.mp3` } };
}
