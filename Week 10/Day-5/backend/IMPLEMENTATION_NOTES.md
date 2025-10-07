# MongoDB Integration & Batch Processing - Implementation Summary

## What's New

### 1. MongoDB Integration ✅
- **Persistent Storage**: All assignments and submissions are now stored in MongoDB instead of in-memory
- **Data Survives Restarts**: Your data persists across server restarts
- **Mongoose ODM**: Using Mongoose schemas for type-safe database operations

### 2. Batch PDF Processing ✅
- **Upload Multiple PDFs**: Teachers can now upload up to 50 PDF files at once
- **Asynchronous Processing**: Submissions are queued and processed one-by-one
- **Non-blocking**: API responds immediately after upload; evaluation happens in background

### 3. Queue System ✅
- **In-Memory Queue**: Reliable processing of submissions with retry mechanism
- **Rate Limiting**: Prevents hitting Gemini API rate limits
- **Error Handling**: Failed submissions are tracked and can be retried

### 4. New API Endpoints ✅

#### Retry Failed Submissions
```http
POST /assignments/:id/submissions/retry
```
Re-runs evaluation for all failed submissions of an assignment.

#### Get Queue Status
```http
GET /assignments/:id/queue-status
```
Returns:
```json
{
  "queueSize": 5,
  "isProcessing": true
}
```

## Setup Instructions

### Prerequisites
1. **MongoDB**: Install and run MongoDB locally
   - Download: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

### Installation
```bash
# Install dependencies (already done if you have node_modules)
pnpm install

# Test MongoDB connection
pnpm run test:mongo
```

### Configuration
Edit `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/assignments
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/assignments
```

### Running the Server
```bash
# Development mode (with auto-reload)
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod
```

## How It Works

### Upload Flow
1. Teacher uploads multiple PDFs via `POST /assignments/:id/submissions/upload`
2. Each PDF is processed:
   - Text extraction
   - Metadata detection (student name, roll number)
   - Submission saved to MongoDB with `status='pending'`
3. All submissions added to evaluation queue
4. API responds immediately with created submissions
5. Background worker processes queue one-by-one
6. Each submission evaluated via Gemini API
7. Results saved to MongoDB

### Submission States
- **pending**: Uploaded, waiting for evaluation
- **in-progress**: Currently being evaluated
- **evaluated**: Successfully evaluated with score & remarks
- **failed**: Evaluation failed (can be retried)

### Error Handling
- Failed evaluations are automatically retried up to 3 times
- If max retries exceeded, submission marked as `failed`
- Teachers can manually retry failed submissions via retry endpoint
- Error details stored in submission document

## Database Schema

### Assignment Collection
```javascript
{
  topic: String,
  instructions: String,
  wordCount: Number,
  mode: 'strict' | 'loose',
  createdAt: Date
}
```

### Submission Collection
```javascript
{
  assignmentId: ObjectId,  // References Assignment
  studentName: String,
  rollNumber: String,
  rawText: String,
  score: Number,
  remarks: String,
  status: 'pending' | 'in-progress' | 'evaluated' | 'failed',
  error: String,           // Only for failed submissions
  createdAt: Date
}
```

## API Changes

All existing endpoints work the same, but now:
- Data persists in MongoDB
- Assignment IDs are MongoDB ObjectIds (24-character hex strings)
- All methods are async (return Promises)

### Example: Create Assignment
**Before (in-memory):**
```http
POST /assignments
{
  "topic": "AI Essay",
  "instructions": "Write about AI",
  "wordCount": 500,
  "mode": "strict"
}

Response: { id: "uuid-v4" }
```

**After (MongoDB):**
```http
POST /assignments
{
  "topic": "AI Essay",
  "instructions": "Write about AI",
  "wordCount": 500,
  "mode": "strict"
}

Response: { _id: "507f1f77bcf86cd799439011" }
```

### Example: Batch Upload
```bash
curl -X POST http://localhost:4000/assignments/507f.../submissions/upload \
  -F "files=@student1.pdf" \
  -F "files=@student2.pdf" \
  -F "files=@student3.pdf"
```

**Response:**
```json
{
  "statusCode": 201,
  "message": "3 submission(s) uploaded successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "studentName": "John Doe",
      "rollNumber": "CS-001",
      "status": "pending",
      "createdAt": "2025-10-03T10:30:00.000Z"
    },
    ...
  ]
}
```

## Monitoring

### Check Queue Status
```bash
curl http://localhost:4000/assignments/507f.../queue-status
```

### View All Submissions
```bash
curl http://localhost:4000/assignments/507f.../submissions
```

Filter by status in your application logic or add query parameters as needed.

## Performance Considerations

1. **Concurrency**: Currently processes one submission at a time to avoid rate limits
2. **Queue Size**: Monitor queue size to ensure it's being processed
3. **Retry Delay**: 1 second between each submission evaluation
4. **Max Retries**: 3 attempts per submission

## Future Enhancements

- Add Redis/Bull for distributed queue (multiple workers)
- Implement rate limiting configuration
- Add concurrent processing (configurable N workers)
- Add WebSocket for real-time status updates
- Add batch evaluation API (evaluate all pending at once)
- Add submission filtering by status
- Add pagination for large submission lists

## Troubleshooting

### MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### Queue Not Processing
- Check queue status endpoint
- Check server logs for errors
- Verify Gemini API key is valid
- Check network connectivity

### Submissions Stuck in "in-progress"
This can happen if server crashes during evaluation.
**Solution**: Add a cleanup script or manually update MongoDB:
```javascript
db.submissions.updateMany(
  { status: "in-progress" },
  { $set: { status: "pending" } }
)
```

## Testing

```bash
# Run all tests
pnpm test

# Test MongoDB connection
pnpm run test:mongo

# Test API endpoints
pnpm run test:e2e
```
