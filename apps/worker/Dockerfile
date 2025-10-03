FROM node:18-alpine
WORKDIR /app
COPY package.json tsconfig.json ./
COPY src ./src
RUN npm ci || true && npm run build || true
CMD ["node","dist/index.js"]
