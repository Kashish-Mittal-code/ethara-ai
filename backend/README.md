# Team Task Manager — Backend

This folder contains the backend for the Team Task Manager built with Node.js, Express, and MongoDB. It follows Clean Architecture with Route → Controller → Service → Repository → Model.

Quick start:

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies: `npm install`
3. Run in dev: `npm run dev`

API base: `/api/v1`

## Deployment Notes (Current App Behavior)

- Email verification is not required for signup/login flow.
- Admin login is supported with these env-backed credentials:
  - `ADMIN_EMAIL` (default: `admin@taskflow.local`)
  - `ADMIN_PASS` (default: `AdminPass123!`)

## Deploy Backend (Render/Railway)

1. Create a MongoDB Atlas cluster and copy the connection string.
2. Deploy this `backend` folder as a Node service.
3. Set environment variables:
   - `PORT=5000`
   - `MONGO_URI=<your_mongodb_uri>`
   - `JWT_SECRET=<long_random_secret>`
   - `CLIENT_URL=<your_frontend_url>`
   - `ADMIN_EMAIL=admin@taskflow.local` (or your custom admin email)
   - `ADMIN_PASS=AdminPass123!` (or your custom admin password)
4. Build command: `npm install`
5. Start command: `npm start`
6. After deploy, verify these endpoints:
   - `GET /api/v1/auth/me` (with token)
   - `GET /api/v1/auth/users` (with admin token)
