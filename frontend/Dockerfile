# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_BASE_URL=https://amiable-abundance-production.up.railway.app
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Production stage - serve static files
FROM node:24-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

# Railway injects $PORT; default to 5173 for local Docker.
ENV PORT=5173
EXPOSE 5173

CMD ["sh", "-c", "serve -s dist -l ${PORT}"]