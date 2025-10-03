# Web Dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json tsconfig.base.json ./
COPY apps/web/package.json apps/web/tsconfig.json apps/web/next.config.ts apps/web/postcss.config.js apps/web/tailwind.config.ts ./apps/web/
RUN npm ci --ignore-scripts

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app /app
COPY . .
RUN npm run build -w @audio-ai/web

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/web/.next ./apps/web/.next
COPY --from=build /app/apps/web/package.json ./apps/web/package.json
EXPOSE 3000
CMD ["npm", "run", "start", "-w", "@audio-ai/web"]
