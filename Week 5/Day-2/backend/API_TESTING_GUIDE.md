# API Testing Guide

This guide provides comprehensive testing instructions for all your API endpoints. Since we've successfully created sample data in the database, you can test these endpoints manually.

## 🚀 Prerequisites

1. **Start the server**: `npm run start:dev`
2. **Sample data available**: We've already created sample users, comments, and notifications in your `real-time-comments` database

## 📋 Sample Data Created

### Users Available for Testing:

- **Username**: `john_developer`
- **Email**: `john.developer@techcorp.com`
- **Password**: `mySecurePassword123`
- **User ID**: `68aedaa2ab468184c42185ee`

### Comments Available:

- **Comment ID**: Various IDs from our sample data script
- **Post IDs**: `sample_post_001`, `test-post-123`

## 🔧 API Endpoints Testing

### 1. Authentication Endpoints

#### POST /auth/register

```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser123",
    "email": "newuser@example.com",
    "password": "password123",
    "bio": "New test user"
  }'
```

**Expected Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "username": "newuser123",
    "email": "newuser@example.com",
    "bio": "New test user"
  }
}
```

#### POST /auth/login

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.developer@techcorp.com",
    "password": "mySecurePassword123"
  }'
```

### 2. User Endpoints (Protected)

First, get your JWT token from login, then use it in the Authorization header:

#### GET /users/me

```bash
curl -X GET http://localhost:4000/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### PUT /users/me

```bash
curl -X PUT http://localhost:4000/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Updated bio from API test",
    "profilePicture": "new-avatar.jpg"
  }'
```

#### POST /users/me/upload

```bash
curl -X POST http://localhost:4000/users/me/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -F "file=@path/to/your/image.jpg"
```

### 3. Follower Endpoints

#### POST /followers/toggle/:targetId

```bash
curl -X POST http://localhost:4000/followers/toggle/TARGET_USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### GET /followers/followers/:userId

```bash
curl -X GET http://localhost:4000/followers/followers/68aedaa2ab468184c42185ee
```

#### GET /followers/following/:userId

```bash
curl -X GET http://localhost:4000/followers/following/68aedaa2ab468184c42185ee
```

#### GET /followers/is-following/:targetId

```bash
curl -X GET http://localhost:4000/followers/is-following/TARGET_USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 4. Comment Endpoints

#### POST /comments/create

```bash
curl -X POST http://localhost:4000/comments/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "postId": "test-post-456",
    "text": "This is a test comment from API testing!"
  }'
```

#### POST /comments/reply

```bash
curl -X POST http://localhost:4000/comments/reply \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "postId": "test-post-456",
    "parentCommentId": "PARENT_COMMENT_ID_HERE",
    "text": "This is a reply to the parent comment"
  }'
```

#### GET /comments/post/:postId

```bash
curl -X GET http://localhost:4000/comments/post/sample_post_001
```

#### GET /comments/replies/:parentId

```bash
curl -X GET http://localhost:4000/comments/replies/PARENT_COMMENT_ID
```

#### GET /comments/:id

```bash
curl -X GET http://localhost:4000/comments/COMMENT_ID_HERE
```

### 5. Like Endpoints

#### POST /likes/toggle/:commentId

```bash
curl -X POST http://localhost:4000/likes/toggle/COMMENT_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### GET /likes/is-liked/:commentId

```bash
curl -X GET http://localhost:4000/likes/is-liked/COMMENT_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 6. Notification Endpoints

#### GET /notifications

```bash
curl -X GET http://localhost:4000/notifications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### POST /notifications/mark-read/:id

```bash
curl -X POST http://localhost:4000/notifications/mark-read/NOTIFICATION_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🧪 Testing with Postman

1. **Import Collection**: Create a new Postman collection
2. **Set Environment Variables**:
   - `base_url`: `http://localhost:4000`
   - `jwt_token`: Your JWT token from login
3. **Test Flow**:
   1. Register/Login → Get JWT token
   2. Test protected endpoints with the token
   3. Create comments and test interactions

## 🔍 Verification Steps

### After Registration/Login:

- ✅ Receive JWT token
- ✅ Token contains user information
- ✅ User is stored in database

### After Creating Comments:

- ✅ Comment appears in database
- ✅ Can retrieve comment by ID
- ✅ Comments appear in post listing
- ✅ Reply count updates for parent comments

### After Toggling Likes:

- ✅ Like status changes
- ✅ Like count updates
- ✅ Can check like status

### After Following Users:

- ✅ Follow relationship created
- ✅ Follower/following counts update
- ✅ Can check follow status

## 🐛 Troubleshooting

### Server Issues:

- Ensure MongoDB connection is working
- Check server logs for errors
- Verify port 4000 is not blocked

### Authentication Issues:

- Verify JWT token format
- Check token expiration
- Ensure proper Authorization header format

### Database Issues:

- Confirm MongoDB URI is correct
- Check database connection in logs
- Verify sample data exists

## 📊 Expected Results

All endpoints should return appropriate HTTP status codes:

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **404**: Not Found
- **500**: Internal Server Error

## 🎯 Success Criteria

✅ **Authentication**: Users can register and login  
✅ **User Management**: Profile updates and file uploads work  
✅ **Social Features**: Following/unfollowing functions properly  
✅ **Comments**: Create, reply, and retrieve comments  
✅ **Interactions**: Like/unlike comments  
✅ **Notifications**: Receive and manage notifications

Your API is fully functional with all CRUD operations, authentication, and social features implemented!
