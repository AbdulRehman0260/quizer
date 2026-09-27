# Deployment Guide

## Environment Setup

### Development Environment (Local)

**Frontend:** `http://localhost:5174` (or 5173 if available)  
**Backend:** `http://localhost:3000`  
**Database:** PostgreSQL on `localhost:5432`

**Setup:**
1. Backend reads from `.env.development`:
   - `CORS_ORIGIN=http://localhost:5174` (for local dev)
   - `NODE_ENV=development`

2. Frontend reads from `.env.development`:
   - `VITE_API_BASE_URL=http://localhost:3000`

**Running Locally:**
```bash
# Terminal 1: Start Backend
cd backend
npm install
npm start

# Terminal 2: Start Frontend
cd frontend
npm install
npm run dev

# Terminal 3 (optional): Start PostgreSQL
# If using Docker:
docker run --name postgres -e POSTGRES_DB=questions -e POSTGRES_USER=quiz_app -e POSTGRES_PASSWORD=quiz_app -p 5432:5432 postgres:16-alpine
```

### Production Environment (Docker/Railway)

**Frontend:** `http://localhost:5173` (via Docker)  
**Backend:** `http://backend:3000` (via Docker service name)  
**Database:** PostgreSQL via Docker

**Configuration in `docker-compose.yml`:**
- Frontend uses `VITE_API_BASE_URL=http://backend:3000` (Docker service name)
- Backend uses `CORS_ORIGIN=http://localhost:5173` (default for localhost testing)
- Backend uses `NODE_ENV=production`

**Running Locally with Docker:**
```bash
docker-compose up --build
```

**For Railway Deployment:**
Set environment variables in Railway dashboard:
```
CORS_ORIGIN=https://your-frontend-domain.up.railway.app
VITE_API_BASE_URL=https://your-backend-domain.up.railway.app
```

---

## File Structure

### Backend Environment Files
- `.env` - Production defaults (localhost testing)
- `.env.development` - Development overrides for local work
- `.env.example` - Template for new deployments

### Frontend Environment Files
- `.env.development` - Development settings (API URL: localhost:3000)
- `.env.production` - Production settings (API URL: backend:3000)

---

## Deployment Steps

### 1. Prepare Code for Deployment

```bash
# Make sure all changes are committed
git add -A
git commit -m "chore: prepare for deployment"
git push origin main
```

### 2. Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Select your repository
5. Railway will automatically detect `docker-compose.yml`

### 3. Configure Railway Environment Variables

After Railway starts building, set these in the **Variables** section:

```
# Backend Configuration
DB_HOST=postgres
DB_PORT=5432
DB_NAME=questions
DB_USER=quiz_app
DB_PASSWORD=quiz_app
DB_SSLMODE=disable
HOST=0.0.0.0
PORT=3000
NODE_ENV=production

# Frontend Configuration (for communication with backend)
VITE_API_BASE_URL=http://backend:3000
```

Once your Railway services have URLs, update CORS_ORIGIN:
```
CORS_ORIGIN=https://your-frontend-url.up.railway.app
```

### 4. Verify Deployment

1. Frontend loads at `https://your-frontend-url.up.railway.app`
2. Quiz questions load successfully
3. You can create a user and take the quiz
4. Scores save to database

---

## Port Configuration

- **Development**: 
  - Frontend: 5173 or 5174 (auto-incremented if taken)
  - Backend: 3000

- **Production (Docker)**:
  - Frontend: 5173 → exposed to host
  - Backend: 3000 → exposed to host
  - PostgreSQL: 5432 → internal only (not exposed)

- **Railway**:
  - Auto-generates public URLs for frontend and backend
  - PostgreSQL is managed by Railway

---

## Key Configuration Details

### CORS
- Development: `http://localhost:5174` (or 5173)
- Production: `http://backend:3000` (internal Docker communication)
- Railway: `https://your-frontend-domain.up.railway.app`

### API Base URL
- Development: `http://localhost:3000` (direct connection)
- Production (Docker): `http://backend:3000` (service name)
- Railway: `https://your-backend-domain.up.railway.app` (set in env vars)

### Database
- Development: PostgreSQL on `localhost:5432`
- Production: PostgreSQL in Docker network as `postgres:5432`
- Railway: Managed PostgreSQL with connection string in environment

---

## Troubleshooting

### CORS Errors
- Check that `CORS_ORIGIN` matches your frontend URL
- Verify backend is accessible from frontend

### API Connection Errors
- Development: Check that backend is running on 3000
- Docker: Verify `VITE_API_BASE_URL=http://backend:3000` (service name, not localhost)
- Railway: Ensure `VITE_API_BASE_URL` is set to correct backend URL

### Database Connection Errors
- Check database credentials match in `.env`
- Verify PostgreSQL is running
- Ensure database `questions` exists with tables

---

## Dockerfile Details

### Backend Dockerfile
- Uses Node 24 Alpine (lightweight)
- Installs dependencies and builds TypeScript
- Runs `npm start` (production-ready)

### Frontend Dockerfile
- Multi-stage build (builder + production)
- Builds static files from source
- Serves with `serve` package (production-grade)
- No dev server in production

---

## Git Configuration

`.gitignore` prevents committing:
- `.env` (production local)
- `.env.development` (local dev)
- `.env.production` (local prod build)

But allows tracking:
- `.env.example` (template for contributors)
- Any `.env.*.example` files (deployment examples)

---

## Next Steps

1. Push changes: `git push origin main`
2. Create Railway project
3. Connect GitHub repo
4. Set environment variables
5. Railway deploys automatically on every push to `main`

For questions, refer to the Railway docs: https://docs.railway.app/
