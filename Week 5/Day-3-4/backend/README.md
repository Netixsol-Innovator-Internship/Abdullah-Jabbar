## Deploying to Vercel

This repo is prepared to run on Vercel as a serverless function. Key files:

- `api/index.ts` — serverless entry that bootstraps Nest with an `ExpressAdapter`.
- `vercel.json` — routes and build configuration updated to point to `api/index.ts`.
- `package.json` — contains a `vercel-build` script that runs the normal `nest build`.

Steps:

1. In the Vercel dashboard, create a new project from this repository.
2. Set environment variables (for example `MONGO_URI`, `JWT_SECRET`, `CORS_ORIGIN`, etc.).
3. Deploy. Vercel will run `npm run vercel-build` and build the serverless function.

Notes:

- Socket.IO or other long-lived TCP connections are not suitable for serverless functions — extract them to a separate service if needed.
- The handler reuses the Nest app between invocations to reduce cold starts.

POST /auth/register
POST /auth/login

GET /users/me (protected)
PUT /users/me (protected)
POST /users/me/upload (protected, multipart/form-data)

POST /followers/toggle/:targetId (protected)
GET /followers/followers/:userId
GET /followers/following/:userId
GET /followers/is-following/:targetId (protected)

POST /comments/create (protected)   { postId, text }
POST /comments/reply (protected)    { postId, parentCommentId, text }
GET  /comments/post/:postId
GET  /comments/replies/:parentId
GET  /comments/:id

POST /likes/toggle/:commentId (protected)
GET  /likes/is-liked/:commentId (protected)

GET  /notifications (protected)
POST /notifications/mark-read/:id (protected)
POST /auth/register
POST /auth/login

GET /users/me (protected)
PUT /users/me (protected)
POST /users/me/upload (protected, multipart/form-data)

POST /followers/toggle/:targetId (protected)
GET /followers/followers/:userId
GET /followers/following/:userId
GET /followers/is-following/:targetId (protected)

POST /comments/create (protected)   { postId, text }
POST /comments/reply (protected)    { postId, parentCommentId, text }
GET  /comments/post/:postId
GET  /comments/replies/:parentId
GET  /comments/:id

POST /likes/toggle/:commentId (protected)
GET  /likes/is-liked/:commentId (protected)

GET  /notifications (protected)
POST /notifications/mark-read/:id (protected)
