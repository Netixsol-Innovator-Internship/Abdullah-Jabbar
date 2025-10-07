# NestJS AI Assignment Checker - API Documentation

## Overview
This is a complete implementation of the NestJS AI-powered assignment checker with Gemini API integration.

## Setup Instructions

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory with the following:

```env
# Server Configuration
PORT=4000

# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent

# File Storage
OUTPUT_DIR=./output
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Application Settings
MAX_WORD_COUNT=5000
```

**Important**: Replace `your_gemini_api_key_here` with your actual Gemini API key from Google AI Studio.

### 3. Run the Application
```bash
# Development mode
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod
```

The server will start on `http://localhost:4000`

## API Endpoints

### 1. Create Assignment
**POST** `/assignments`

Create a new assignment with instructions.

**Request Body:**
```json
{
  "topic": "Essay on Climate Change",
  "instructions": "Write a comprehensive essay on the impacts of climate change on global ecosystems. Include scientific evidence and real-world examples.",
  "wordCount": 500,
  "mode": "strict"
}
```

**Response:**
```json
{
  "statusCode": 201,
  "message": "Assignment created successfully",
  "data": {
    "id": "uuid-here",
  "topic": "Essay on Climate Change",
    "instructions": "Write a comprehensive essay...",
    "wordCount": 500,
    "mode": "strict",
    "createdAt": "2025-10-03T10:00:00.000Z"
  }
}
```

### 2. Get All Assignments
**GET** `/assignments`

Retrieve all assignments.

**Response:**
```json
{
  "statusCode": 200,
  "message": "Assignments retrieved successfully",
  "data": [
    {
      "id": "uuid-here",
  "topic": "Essay on Climate Change",
      "instructions": "Write a comprehensive essay...",
      "wordCount": 500,
      "mode": "strict",
      "createdAt": "2025-10-03T10:00:00.000Z"
    }
  ]
}
```

### 3. Get Assignment with Submissions
**GET** `/assignments/:id`

Retrieve a specific assignment with all its submissions.

**Response:**
```json
{
  "statusCode": 200,
  "message": "Assignment retrieved successfully",
  "data": {
    "assignment": {
      "id": "uuid-here",
  "topic": "Essay on Climate Change",
      "instructions": "Write a comprehensive essay...",
      "wordCount": 500,
      "mode": "strict",
      "createdAt": "2025-10-03T10:00:00.000Z"
    },
    "submissions": [
      {
        "id": "submission-uuid",
        "assignmentId": "uuid-here",
        "studentName": "John Doe",
        "rollNumber": "12345",
        "rawText": "Climate change is...",
        "score": 85,
        "remarks": "Well-written essay with good examples.",
        "status": "evaluated",
        "createdAt": "2025-10-03T10:30:00.000Z"
      }
    ]
  }
}
```

### 4. Upload Submissions
**POST** `/assignments/:id/submissions/upload`

Upload multiple PDF submissions for an assignment.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `files`: PDF files (multiple files allowed, up to 50)

**How to use (example with curl):**
```bash
curl -X POST http://localhost:4000/assignments/{assignment-id}/submissions/upload \
  -F "files=@student1.pdf" \
  -F "files=@student2.pdf" \
  -F "files=@student3.pdf"
```

**PDF Format Requirements:**
The first few lines of each PDF should contain student information in one of these formats:
```
Name: John Doe
Roll Number: 12345
```
or
```
Student Name: Jane Smith
Roll No: 67890
```
or
```
John Doe - 12345
```

**Response:**
```json
{
  "statusCode": 201,
  "message": "3 submission(s) uploaded successfully",
  "data": [
    {
      "id": "submission-uuid-1",
      "assignmentId": "uuid-here",
      "studentName": "John Doe",
      "rollNumber": "12345",
      "rawText": "Extracted text...",
      "status": "pending",
      "createdAt": "2025-10-03T10:30:00.000Z"
    }
  ]
}
```

### 5. Evaluate Submissions
**POST** `/assignments/:id/evaluate`

Evaluate all pending submissions using Gemini AI.

**Response:**
```json
{
  "statusCode": 200,
  "message": "3 submission(s) evaluated successfully",
  "data": [
    {
      "id": "submission-uuid-1",
      "assignmentId": "uuid-here",
      "studentName": "John Doe",
      "rollNumber": "12345",
      "rawText": "Climate change is...",
      "score": 85,
      "remarks": "Well-written essay with comprehensive coverage. Good use of examples and scientific evidence. Minor grammatical issues noted.",
      "status": "evaluated",
      "createdAt": "2025-10-03T10:30:00.000Z"
    }
  ]
}
```

### 6. Get Submissions
**GET** `/assignments/:id/submissions`

Get all submissions for a specific assignment.

**Response:**
```json
{
  "statusCode": 200,
  "message": "Submissions retrieved successfully",
  "data": [
    {
      "id": "submission-uuid-1",
      "assignmentId": "uuid-here",
      "studentName": "John Doe",
      "rollNumber": "12345",
      "rawText": "Climate change is...",
      "score": 85,
      "remarks": "Well-written essay...",
      "status": "evaluated",
      "createdAt": "2025-10-03T10:30:00.000Z"
    }
  ]
}
```

### 7. Download Marks Sheet
**GET** `/assignments/:id/marks-sheet?format=xlsx`

Generate and download an Excel or CSV marks sheet with all evaluation results.

**Query Parameters:**
- `format`: `xlsx` (default) or `csv`

**Response:**
File download with the following columns:
- Student Name
- Roll Number
- Score
- Remarks
- Status

**Example:**
```bash
# Download Excel file
curl -O -J http://localhost:4000/assignments/{assignment-id}/marks-sheet?format=xlsx

# Download CSV file
curl -O -J http://localhost:4000/assignments/{assignment-id}/marks-sheet?format=csv
```

## Complete Workflow Example

### 1. Create an Assignment
```bash
curl -X POST http://localhost:4000/assignments \
  -H "Content-Type: application/json" \
  -d '{
  "topic": "Climate Change Essay",
    "instructions": "Write about climate change impacts",
    "wordCount": 500,
    "mode": "strict"
  }'
```

### 2. Upload Student PDFs
```bash
curl -X POST http://localhost:4000/assignments/{assignment-id}/submissions/upload \
  -F "files=@student1.pdf" \
  -F "files=@student2.pdf"
```

### 3. Evaluate Submissions
```bash
curl -X POST http://localhost:4000/assignments/{assignment-id}/evaluate
```

### 4. Download Marks Sheet
```bash
curl -O -J http://localhost:4000/assignments/{assignment-id}/marks-sheet?format=xlsx
```

## Features Implemented

✅ **Assignment Module**
- Create assignments with topic, instructions, word count, and evaluation mode
- Store assignments in memory (can be easily replaced with database)
- Full CRUD operations

✅ **PDF Processing**
- Extract text from PDF files using `pdf-parse`
- Automatically detect student name and roll number from PDF content
- Clean and sanitize extracted text
- Handle multiple PDF uploads simultaneously

✅ **AI Evaluation**
- Integration with Gemini API via LangGraph
- Structured JSON-only prompts for consistent evaluation
- Support for strict and loose evaluation modes
- Automatic score validation (0-100 range)
- Detailed remarks generation

✅ **Excel/CSV Generation**
- Generate formatted Excel files using `exceljs`
- Generate CSV files for compatibility
- Styled headers and auto-fitted columns
- Downloadable marks sheets

✅ **Utilities**
- Text cleaning and normalization
- Student metadata extraction
- File size and type validation
- Error handling and logging

## Evaluation Modes

### Strict Mode
- Heavily penalizes off-topic content
- Enforces word count strictly (±10% tolerance)
- Critical evaluation of structure and grammar
- Score range: 0-100 (critical grading)

### Loose Mode
- More forgiving and encouraging
- Word count is less critical (±30% tolerance)
- Gives credit for effort and understanding
- Score range: 40-100 (generous grading)

## Error Handling

The API includes comprehensive error handling:
- 400 Bad Request: Invalid input, file type errors
- 404 Not Found: Assignment or submission not found
- 500 Internal Server Error: Server-side errors (logged for debugging)

## Notes

1. **In-Memory Storage**: Current implementation uses in-memory storage. For production, integrate with a database (PostgreSQL, MongoDB, etc.)

2. **File Storage**: Uploaded PDFs are processed in memory. Generated Excel/CSV files are stored in the `OUTPUT_DIR`.

3. **Gemini API**: Ensure you have a valid API key from Google AI Studio. The free tier has rate limits.

4. **PDF Format**: Students should include their name and roll number at the beginning of their PDF submissions for automatic detection.

5. **Scalability**: For production use, consider:
   - Implementing database storage
   - Adding authentication/authorization
   - Implementing rate limiting
   - Using a job queue for evaluations
   - Adding file upload limits and validation

## Troubleshooting

### "GEMINI_API_KEY is not set" warning
- Add your Gemini API key to the `.env` file

### PDF extraction fails
- Ensure PDFs are text-based, not scanned images
- Check PDF file is not corrupted
- Verify file size is within limits

### Evaluation fails
- Check Gemini API key is valid
- Verify internet connection
- Check API rate limits

### Marks sheet download fails
- Ensure OUTPUT_DIR exists and is writable
- Check submissions have been evaluated
- Verify assignment has submissions

## License
UNLICENSED
