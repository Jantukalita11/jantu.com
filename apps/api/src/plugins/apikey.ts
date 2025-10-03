import fp from "fastify-plugin";
import { FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    apiKey?: string;
  }
}

function extractApiKey(req: FastifyRequest): string | undefined {
  return (req.headers["x-api-key"] as string) || req.headers["authorization"]?.toString().replace(/^Bearer\s+/i, "");
}

export default fp(async (app) => {
  app.decorateRequest("apiKey", undefined);
  app.addHook("onRequest", async (req) => {
    const key = extractApiKey(req);
    if (key) req.apiKey = key;
  });

  app.decorate("requireApiKey", async (req: FastifyRequest) => {
    if (!req.apiKey) {
      throw app.httpErrors.unauthorized("Missing API key");
    }
    // TODO: validate key against database and set team context
  });
});
