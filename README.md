# Team Task Manager (MERN)

This repository contains a production-oriented MERN stack application scaffold for a Team Task Manager SaaS. It follows Clean Architecture: Route → Controller → Service → Repository → Model.

Folders:

- `backend/` — Express API with Mongoose models
- `frontend/` — Vite + React + Tailwind frontend

Deployment (summary):

1. Create a MongoDB Atlas cluster and get `MONGO_URI`.
2. Deploy backend (Render or Railway) with env vars: `MONGO_URI`, `JWT_SECRET`, `PORT`, `CLIENT_URL`, `ADMIN_EMAIL`, `ADMIN_PASS`.
3. Deploy frontend (Vercel/Netlify/Railway) with `VITE_API_URL=<backend-url>/api/v1`.
4. Confirm workflow:
   - New user can signup and login directly (no email verification required).
   - Login page includes Admin button.
   - Admin credentials can access admin console and assign tasks.

See `backend/README.md` and `frontend/README.md` for per-service instructions.
