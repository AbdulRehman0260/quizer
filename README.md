
# General Specific Quiz Game 🧠

A full-stack quiz web application where users can test their general and specific trivia knowledge. Built with a React frontend and an Express backend.

## 📁 Repository Structure

This repository is organized as a monorepo containing both the client and server code:

- `/frontend` - The user interface built with React, Vite, and CSS.
- `/backend` - The REST API server built with Express and Node.js.
- `docker-compose.yml` - Configuration to orchestrate running both environments seamlessly.

---

## 🚀 Getting Started

You can run this project locally either by launching the services individually or by using Docker Compose.

### Method 1: Using Docker (Recommended)

Ensure you have Docker and Docker Compose installed, then run the following command in the root directory:

```bash
docker-compose up --build
```

This will automatically build and start both the backend server and the frontend application.

### Method 2: Manual Local Setup

If you prefer to run the applications directly on your machine, follow these steps:

#### 1. Setup the Backend

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   npm start
   ```

   *The server will typically run on `http://localhost:3000`*

#### 2. Setup the Frontend

1. Open a new terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

   *The frontend application will typically run on `http://localhost:5173`*

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, HTML5, CSS3
- **Backend:** Node.js, Express
- **DevOps:** Docker, Docker Compose

---

## 🔒 CORS Configuration Note

To ensure the frontend can communicate with the backend locally, the Express server must have the `cors` package enabled and configured to accept incoming traffic from the React client origin (`http://localhost:5173`).
