import { FastifyInstance } from "fastify";

export default async function webhooksRoutes(app: FastifyInstance) {
  app.post("/webhooks/stripe", async (_req, reply) => {
    // TODO: verify signature and handle events
    return reply.code(200).send({ received: true });
  });
}
