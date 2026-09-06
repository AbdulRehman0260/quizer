#!/bin/bash
set -e

echo "🔨 Building services..."
docker compose build

echo "🚀 Starting services..."
docker compose up -d

echo "⏳ Waiting for database..."
timeout 60 bash -c 'until docker compose exec -T postgres pg_isready -U quiz_app -d questions; do sleep 1; done'

echo "🔄 Running migrations..."
docker compose exec -T backend npm run migrate

echo "✅ Running backend tests..."
docker compose exec -T backend npm test -- --passWithNoTests

echo "✅ Running frontend linting..."
docker compose exec -T frontend npm run lint

echo "✅ Running frontend tests..."
docker compose exec -T frontend npm test -- --passWithNoTests

echo "✅ Building frontend..."
docker compose exec -T frontend npm run build

echo "🧹 Cleaning up..."
docker compose down -v

echo "✨ All checks passed!"