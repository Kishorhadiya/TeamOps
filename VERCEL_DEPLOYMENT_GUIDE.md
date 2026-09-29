# 🚀 Vercel Deployment Guide

This project consists of three services:
1. **`frontend`** (Vite + React SPA)
2. **`backend`** (Express.js Employee & Events API)
3. **`Admin`** (Express.js Admin & Leave Management API)

All necessary `vercel.json` configuration files, CORS settings, database SSL handling, and environment variable support have been configured.

---

## 📁 Project Structure & Vercel Config Files

```
PostGress_Project/
├── frontend/
│   ├── vercel.json          <-- Handles Vite SPA routing rewrites
│   ├── .env.example         <-- Frontend environment variables
│   └── ...
├── backend/
│   ├── vercel.json          <-- Handles Serverless Express routing
│   ├── server.js            <-- Exports app for Vercel Serverless
│   ├── .env.example         <-- Backend environment variables
│   └── ...
├── Admin/
│   ├── vercel.json          <-- Handles Serverless Express routing
│   ├── server.js            <-- Exports app for Vercel Serverless
│   ├── .env.example         <-- Admin backend environment variables
│   └── ...
└── .gitignore
```

---

## 🛠️ Step-by-Step Deployment on Vercel

### 1. Deploy the `backend` API
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New... > Project**.
2. Import your GitHub repository.
3. In **Root Directory**, click **Edit** and select `backend`.
4. Under **Environment Variables**, add:
   - `PG_URL`: `your_postgresql_connection_string`
   - `TOKEN_1`: `your_jwt_secret_token`
   - `PORT`: `3001`
   - `FRONTEND_URL`: `https://your-frontend-app.vercel.app,http://localhost:5173`
5. Click **Deploy**.
6. Note down the deployed URL (e.g., `https://my-backend-app.vercel.app`).

---

### 2. Deploy the `Admin` API
1. In Vercel Dashboard, click **Add New... > Project**.
2. Import the same GitHub repository.
3. In **Root Directory**, click **Edit** and select `Admin`.
4. Under **Environment Variables**, add:
   - `PG_URL`: `your_postgresql_connection_string`
   - `TOKEN_1`: `your_jwt_access_token_secret`
   - `REFRESH_SECRET`: `your_jwt_refresh_token_secret`
   - `PORT`: `8000`
   - `FRONTEND_URL`: `https://your-frontend-app.vercel.app,http://localhost:5173`
5. Click **Deploy**.
6. Note down the deployed URL (e.g., `https://my-admin-app.vercel.app`).

---

### 3. Deploy the `frontend`
1. In Vercel Dashboard, click **Add New... > Project**.
2. Import the same repository.
3. In **Root Directory**, click **Edit** and select `frontend`.
4. Framework Preset will be automatically detected as **Vite**.
5. Under **Environment Variables**, configure:
   - `VITE_ADMIN_API_URL`: `https://my-admin-app.vercel.app/api/v1`
   - `VITE_BACKEND_API_URL`: `https://my-backend-app.vercel.app/api/v1`
   - `VITE_LEAVE_API_URL`: `https://my-admin-app.vercel.app/leave`
6. Click **Deploy**.

---

## 💻 Alternative: Deploying via Vercel CLI

If you prefer deploying using the command line:

```bash
# Install Vercel CLI globally
npm install -g vercel

# 1. Deploy Backend
cd backend
vercel --prod

# 2. Deploy Admin Backend
cd ../Admin
vercel --prod

# 3. Deploy Frontend
cd ../frontend
vercel --prod
```
