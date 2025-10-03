# Audio AI Studio (Monorepo)

Modern SaaS for ultra-realistic TTS/STT, voice cloning, dubbing, conversational AI, and music/SFX. Includes web UI, REST API, SDKs, Docker, and Terraform skeleton.

## Apps & Packages
- `apps/web`: Next.js 14 + Tailwind UI
- `apps/api`: Express + TypeScript API (v1)
- `packages/sdk-js`: JS/TS SDK
- `packages/sdk-python`: Python SDK
- `packages/openapi`: OpenAPI 3 spec
- `infra/terraform`: AWS skeleton infra

## Quick start (local)
1. Copy envs: `cp .env.example .env`
2. Install deps: `npm ci`
3. Start API: `npm run dev -w @audio-ai/api`
4. Start Web: `npm run dev -w @audio-ai/web`
5. Visit web: http://localhost:3000, API: http://localhost:4000/health and docs at http://localhost:4000/v1/docs

Notes:
- Prisma requires `DATABASE_URL`; use Docker for local DB or update `.env`.
- Current endpoints are placeholders; connect to inference jobs and storage.

## Docker (all-in-one dev)
- Build and run: `docker compose up --build`
- Services: web (3000), api (4000), postgres (5432), redis (6379), minio (9000/9001)
- Create bucket: access MinIO console at http://localhost:9001 and create `audio-ai-media`.

## Monorepo commands
- Build all: `npm run build`
- Lint: `npm run lint`
- Format: `npm run format`

## Architecture (high-level)
- API exposes v1 endpoints: auth, TTS, STT, voices, cloning, jobs, billing, projects, dubbing, conversation, music, docs.
- Job queues: BullMQ (Redis). Workers placeholders in-process.
- Storage: S3-compatible (MinIO for dev). Signed URLs for assets.
- Media: FFmpeg helper stub for processing.
- Security: Helmet, CORS, rate limiting. JWT-based auth placeholder and RBAC middleware.

## Next steps
- Wire real inference endpoints (SageMaker/TorchServe) for TTS/STT/VC/dubbing.
- Add proper RBAC with teams, quotas, and audit logs.
- Implement Stripe products/prices and webhooks.
- Expand OpenAPI and generate SDKs automatically.
- Add end-to-end tests and CI gating.

## License
Proprietary. © Audio AI Studio.
