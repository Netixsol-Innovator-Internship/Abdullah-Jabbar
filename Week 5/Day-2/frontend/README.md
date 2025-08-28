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
