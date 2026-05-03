# Team Task Manager — Frontend

This is a Vite + React frontend using TailwindCSS.

Environment:

- Create `.env` with `VITE_API_URL` to point to backend API (e.g., `http://localhost:5000/api/v1`).

Run:

```
npm install
npm run dev
```

## Deploy Frontend (Vercel/Netlify)

1. Deploy this `frontend` folder as a static React/Vite app.
2. Set environment variable:
   - `VITE_API_URL=https://<your-backend-domain>/api/v1`
3. Build command: `npm run build`
4. Output directory: `dist`

After deploy, check:

- Signup works without any email verification step.
- Login page shows Admin button.
- Admin credentials can open admin console and access users/projects/tasks.
