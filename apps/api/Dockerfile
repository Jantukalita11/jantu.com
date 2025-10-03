FROM node:18-alpine
WORKDIR /app
COPY package.json tsconfig.json openapi.yaml ./
COPY src ./src
RUN npm ci || true && npm run build || true
EXPOSE 4000
CMD ["node","dist/index.js"]
