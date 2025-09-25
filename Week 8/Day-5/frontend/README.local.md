Local development notes

This frontend is configured to proxy API requests during development to the backend running on http://localhost:3001.

How it works
- next.config.ts contains a rewrite so requests starting with /api will be forwarded to the backend.
- The frontend code uses NEXT_PUBLIC_API_BASE (default: /api) to build requests. You can override it for different environments.

Run both servers (PowerShell)

# from the backend folder
cd ..\backend
npm install
npm run start:dev

# in a new terminal, from the frontend folder
cd ..\frontend
npm install
npm run dev

If you prefer not to use the Next rewrite, set NEXT_PUBLIC_API_BASE to the backend URL when running the frontend:

$env:NEXT_PUBLIC_API_BASE = "http://localhost:3001/api"
npm run dev

Notes
- Ensure the backend is listening on port 3001 (default in backend/src/main.ts). If you change the backend port, update next.config.ts or set NEXT_PUBLIC_API_BASE accordingly.
- The ApiKeyGuard currently allows all requests in development. If you enable API key checking, include the required header from the frontend when calling endpoints.
