import { FastifyInstance } from "fastify";
import { z } from "zod";
import { enqueueStt } from "../services/queue";

const SttBody = z.object({
  audioUrl: z.string().url().optional(),
  language: z.string().optional(),
  diarize: z.boolean().optional(),
});

export default async function sttRoutes(app: FastifyInstance) {
  app.post("/stt", { preHandler: app.requireApiKey as any }, async (req, reply) => {
    const contentType = req.headers["content-type"] || "";
    if (contentType.includes("multipart/form-data")) {
      const parts = await (req as any).parts();
      for await (const part of parts) {
        if (part.type === "file") {
          // TODO: store upload to S3 and pass upload key to job
          const job = await enqueueStt({ uploadKey: `uploads/${part.filename}` });
          return reply.code(202).send({ jobId: job.id });
        }
      }
      return reply.badRequest("No file part provided");
    } else {
      const body = SttBody.parse(req.body);
      if (!body.audioUrl) return reply.badRequest("audioUrl required when not uploading file");
      const job = await enqueueStt(body);
      return reply.code(202).send({ jobId: job.id });
    }
  });
}
