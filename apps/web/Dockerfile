FROM node:18-alpine
WORKDIR /app
COPY package.json next.config.js tailwind.config.ts postcss.config.js ./
COPY app ./app
COPY components ./components
COPY styles ./styles
RUN npm ci || true && npm run build || true
EXPOSE 3000
CMD ["npm","start"]
