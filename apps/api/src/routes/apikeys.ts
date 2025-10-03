import { FastifyInstance } from "fastify";
import { generateApiKey, hashKey } from "../utils/keys";

export default async function apiKeysRoutes(app: FastifyInstance) {
  app.get("/apikeys", async (_req, reply) => {
    const keys = await app.prisma.apiKey.findMany({ take: 50, orderBy: { createdAt: "desc" } });
    return reply.send(keys.map((k) => ({ id: k.id, name: k.name, createdAt: k.createdAt })));
  });

  app.post("/apikeys", async (req, reply) => {
    const name = (req.body as any)?.name || "Default Key";
    const { key, hash } = generateApiKey();
    const created = await app.prisma.apiKey.create({ data: { name, keyHash: hash, teamId: "demo-team" } });
    return reply.code(201).send({ id: created.id, name: created.name, apiKey: key });
  });

  app.delete("/apikeys/:id", async (req, reply) => {
    const id = (req.params as any).id as string;
    await app.prisma.apiKey.delete({ where: { id } });
    return reply.code(204).send();
  });
}
