# Quick Start Guide - MongoDB & Batch Processing

## Prerequisites Setup

### 1. Install MongoDB

**Option A: Local MongoDB (Recommended for Development)**

**Windows:**
```bash
# Download and install from:
https://www.mongodb.com/try/download/community

# Start MongoDB service
net start MongoDB
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

**Option B: MongoDB Atlas (Cloud - Free Tier Available)**
1. Visit https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a free cluster
4. Get connection string
5. Update `.env` with your connection string

### 2. Verify MongoDB is Running

```bash
pnpm run test:mongo
```

You should see:
```
✓ Successfully connected to MongoDB!
Database name: assignments
✓ Disconnected from MongoDB
```

## Installation & Setup

```bash
# 1. Install dependencies (if not already done)
pnpm install

# 2. Configure environment
# Edit .env file and set MONGODB_URI

# 3. Build the project
pnpm run build

# 4. (Optional) Setup database indexes for better performance
pnpm run setup:db

# 5. (Optional) Seed sample data for testing
pnpm run seed:data

# 6. Start the server
pnpm run start:dev
```

Server will start on http://localhost:4000

## Testing the API

### 1. Create an Assignment

```bash
curl -X POST http://localhost:4000/assignments \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Impact of AI on Society",
    "instructions": "Write a 500-word essay discussing AI impact",
    "wordCount": 500,
    "mode": "strict"
  }'
```

Response:
```json
{
  "statusCode": 201,
  "message": "Assignment created successfully",
  "data": {
    "_id": "67345e2b8f9a1c2d3e4f5678",
    "topic": "Impact of AI on Society",
    ...
  }
}
```

**Save the `_id` for next steps!**

### 2. Upload Multiple PDF Submissions

```bash
# Create test PDFs first (or use your own)
curl -X POST http://localhost:4000/assignments/67345e2b8f9a1c2d3e4f5678/submissions/upload \
  -F "files=@student1.pdf" \
  -F "files=@student2.pdf" \
  -F "files=@student3.pdf"
```

Response:
```json
{
  "statusCode": 201,
  "message": "3 submission(s) uploaded successfully",
  "data": [
    {
      "_id": "67345...",
      "studentName": "John Doe",
      "rollNumber": "CS-001",
      "status": "pending",
      ...
    }
  ]
}
```

### 3. Check Queue Status

```bash
curl http://localhost:4000/assignments/67345e2b8f9a1c2d3e4f5678/queue-status
```

Response:
```json
{
  "statusCode": 200,
  "data": {
    "queueSize": 2,
    "isProcessing": true
  }
}
```

### 4. View All Submissions

```bash
curl http://localhost:4000/assignments/67345e2b8f9a1c2d3e4f5678/submissions
```

### 5. Trigger Evaluation (if needed)

```bash
curl -X POST http://localhost:4000/assignments/67345e2b8f9a1c2d3e4f5678/evaluate
```

### 6. Retry Failed Submissions

```bash
curl -X POST http://localhost:4000/assignments/67345e2b8f9a1c2d3e4f5678/submissions/retry
```

### 7. Download Marks Sheet

```bash
# Download as Excel (.xlsx)
curl http://localhost:4000/assignments/67345e2b8f9a1c2d3e4f5678/marks-sheet \
  --output marks.xlsx

# Download as CSV
curl "http://localhost:4000/assignments/67345e2b8f9a1c2d3e4f5678/marks-sheet?format=csv" \
  --output marks.csv
```

## Workflow Example

### Typical Teacher Workflow:

1. **Create Assignment**
   ```bash
   POST /assignments
   ```

2. **Collect Student PDFs** (from email, LMS, etc.)

3. **Batch Upload**
   ```bash
   POST /assignments/:id/submissions/upload
   # Upload all PDFs at once
   ```

4. **Monitor Progress**
   ```bash
   GET /assignments/:id/queue-status
   # Check until queueSize is 0
   ```

5. **Review Results**
   ```bash
   GET /assignments/:id/submissions
   # Check all submissions are "evaluated"
   ```

6. **Handle Failed Submissions**
   ```bash
   # If any submissions failed:
   POST /assignments/:id/submissions/retry
   ```

7. **Export Marks**
   ```bash
   GET /assignments/:id/marks-sheet?format=xlsx
   ```

## Monitoring Logs

The server logs provide detailed information:

```
[AssignmentsService] Processing 3 PDF uploads for assignment 67345...
[AssignmentsService] Created submission 67346... for Alice Johnson (CS-001)
[QueueService] Enqueued 3 items. Queue size: 3
[QueueService] Processing item 67346... (attempt 1/4)
[AssignmentsService] Successfully evaluated submission 67346...
```

## Troubleshooting

### MongoDB Connection Issues
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB service or check connection string

### Submissions Stuck in "pending"
**Check:**
1. Queue status: `GET /assignments/:id/queue-status`
2. Server logs for errors
3. Gemini API key is valid in `.env`

### Evaluation Failures
**Common causes:**
- Invalid Gemini API key
- Rate limit exceeded
- Network issues
- Malformed PDF (cannot extract text)

**Solution:** Use retry endpoint after fixing the issue

### All Submissions Failed
**Check:**
1. `.env` has valid `GEMINI_API_KEY`
2. Network connectivity
3. Server logs for specific error messages

## Performance Tips

1. **Batch Size:** Upload 10-20 PDFs at a time for optimal performance
2. **Queue Monitoring:** Check queue-status regularly during batch processing
3. **Database Indexes:** Run `pnpm run setup:db` for better query performance
4. **Rate Limiting:** Current delay is 1 second between evaluations (to avoid Gemini API limits)

## Next Steps

- Review [IMPLEMENTATION_NOTES.md](./IMPLEMENTATION_NOTES.md) for detailed architecture
- Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for all endpoints
- See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for automated tests

## Production Deployment

Before deploying to production:

1. Use MongoDB Atlas or a managed MongoDB service
2. Set proper environment variables
3. Enable authentication on MongoDB
4. Configure CORS properly in `main.ts`
5. Add rate limiting middleware
6. Set up monitoring and logging
7. Consider using Redis/Bull for distributed queue

## Support

If you encounter issues:
1. Check server logs
2. Verify MongoDB is running
3. Test MongoDB connection: `pnpm run test:mongo`
4. Review `.env` configuration
5. Check Gemini API key validity
