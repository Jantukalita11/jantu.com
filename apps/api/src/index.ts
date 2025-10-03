import Fastify from "fastify";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import prismaPlugin from "./plugins/prisma";
import healthRoutes from "./routes/health";
import apiKeyPlugin from "./plugins/apikey";
import usagePlugin from "./plugins/usage";
import ttsRoutes from "./routes/tts";
import sttRoutes from "./routes/stt";
import jobsRoutes from "./routes/jobs";
import apiKeysRoutes from "./routes/apikeys";
import webhooksRoutes from "./routes/webhooks";

dotenv.config({ path: ".env" });

const server = Fastify({ logger: { transport: { target: "pino-pretty" } } });

async function bootstrap() {
  await server.register(cors, { origin: true, credentials: true });
  await server.register(sensible);
  await server.register(rateLimit, { max: 100, timeWindow: "1 minute" });
  await server.register(swagger, { openapi: { info: { title: "Audio AI API", version: "0.1.0" } } });
  await server.register(swaggerUi, { routePrefix: "/docs" });
  await server.register(apiKeyPlugin);
  await server.register(usagePlugin);
  await server.register(prismaPlugin);
  await server.register(healthRoutes, { prefix: "/" });
  await server.register(ttsRoutes, { prefix: "/v1" });
  await server.register(sttRoutes, { prefix: "/v1" });
  await server.register(jobsRoutes, { prefix: "/v1" });
  await server.register(apiKeysRoutes, { prefix: "/v1" });
  await server.register(webhooksRoutes, { prefix: "/" });

  const port = Number(process.env.API_PORT ?? 4000);
  const host = process.env.API_HOST ?? "0.0.0.0";
  try {
    const address = await server.listen({ port, host });
    server.log.info(`API listening at ${address}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

bootstrap();
