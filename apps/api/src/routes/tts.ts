import { FastifyInstance } from "fastify";
import { z } from "zod";
import { enqueueTts } from "../services/queue";

const TtsBody = z.object({
  text: z.string().min(1),
  voiceId: z.string().min(1),
  language: z.string().optional(),
  speed: z.number().min(0.5).max(2).optional(),
  pitch: z.number().min(-12).max(12).optional(),
  prosody: z.record(z.any()).optional(),
  ssml: z.string().optional(),
  format: z.enum(["mp3", "wav", "pcm"]).default("mp3"),
  projectId: z.string().optional(),
});

export default async function ttsRoutes(app: FastifyInstance) {
  app.post("/tts", { preHandler: app.requireApiKey as any }, async (req, reply) => {
    const body = TtsBody.parse(req.body);
    const job = await enqueueTts(body);
    return reply.code(202).send({ jobId: job.id });
  });
}
