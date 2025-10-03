# Audio AI Studio (Monorepo)

Monorepo containing a Next.js web app, Fastify API, and background worker for an Audio AI Studio with TTS/STT, voice cloning workflows, and usage-based billing.

## Getting started

- Prerequisites: Docker, Node 18+
- Copy `.env.example` to `.env` in the project root and in `apps/api` if needed
- Start local stack:

```bash
docker compose up --build
```

Services:
- API: http://localhost:4000 (docs at /docs)
- Web: http://localhost:3000
- Postgres: 5432
- Redis: 6379
- MinIO: 9000 (console at 9001)

## Workspaces
- apps/api — Fastify API
- apps/web — Next.js app
- apps/worker — BullMQ worker
- packages/shared — shared types/utils
- packages/sdk — JavaScript SDK
- packages/python-sdk — Python SDK

## Next Steps
- Implement auth (NextAuth) and RBAC with teams
- Add Stripe subscriptions and metered billing
- Connect inference backends (TTS/STT) via managed endpoints
- Build Studio UI timeline and dubbing tools
