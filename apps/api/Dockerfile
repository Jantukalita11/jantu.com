# API Dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/tsconfig.json ./apps/api/
RUN npm ci --ignore-scripts

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app /app
COPY . .
RUN npm run build -w @audio-ai/api

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
EXPOSE 4000
CMD ["node", "apps/api/dist/index.js"]
