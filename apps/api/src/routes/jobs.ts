import { FastifyInstance } from "fastify";
import { getJob } from "../services/queue";

export default async function jobsRoutes(app: FastifyInstance) {
  app.get("/jobs/:id", async (req, reply) => {
    const id = (req.params as any).id as string;
    const job = await getJob(id);
    if (!job) return reply.notFound("Job not found");
    const state = await job.getState();
    const result = await job.getState() === "completed" ? job.returnvalue : undefined;
    return { id: job.id, name: job.name, state, progress: job.progress, result };
  });
}
