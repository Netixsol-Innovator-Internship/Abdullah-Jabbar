# Frontend-Backend Integration Guide

This document explains how the frontend and backend are integrated for the Assignment Evaluation System.

## Overview

The application consists of:
- **Backend**: NestJS API running on port 4000
- **Frontend**: Next.js application running on port 3000

## Architecture

### Backend (NestJS)
- **Port**: 4000
- **CORS**: Enabled for all origins (configured for development)
- **Database**: MongoDB
- **Main Features**:
  - Create assignments
  - Upload PDF submissions
  - Evaluate submissions using OpenAI/Gemini
  - Generate marks sheets (XLSX/CSV)

### Frontend (Next.js)
- **Port**: 3000
- **State Management**: React Context API
- **Features**:
  - Create assignment with topic, instructions, word count, and evaluation mode
  - Upload multiple PDF files
  - Real-time evaluation progress tracking
  - View results
  - Download marks sheets

## API Integration

### API Service Layer (`src/lib/api.ts`)

The frontend communicates with the backend through a centralized API service that provides:

1. **createAssignment**: Creates a new assignment
2. **getAssignments**: Fetches all assignments
3. **getAssignment**: Fetches a single assignment
4. **uploadSubmissions**: Uploads PDF files for evaluation
5. **getSubmissions**: Fetches all submissions for an assignment
6. **evaluateAssignment**: Triggers the evaluation process
7. **downloadMarksSheet**: Downloads the marks sheet (XLSX or CSV)
8. **pollSubmissions**: Polls for submission updates during evaluation

### Data Flow

1. **Assignment Creation**:
   ```
   User fills form → AssignmentForm → AssignmentContext → API.createAssignment → Backend
   ```

2. **File Upload**:
   ```
   User drops PDFs → FileUploader → AssignmentContext (local state)
   ```

3. **Evaluation Process**:
   ```
   User clicks "Start Evaluation" →
   1. API.createAssignment (creates assignment in backend)
   2. API.uploadSubmissions (uploads all PDFs)
   3. API.evaluateAssignment (starts evaluation)
   4. pollSubmissions (polls for updates every 2 seconds)
   5. Updates UI in real-time
   ```

4. **Download Marks Sheet**:
   ```
   User clicks download → API.downloadMarksSheet → Backend generates file → Browser downloads
   ```

## Configuration

### Environment Variables

**Backend** (`.env`):
```env
MONGODB_URI=mongodb://localhost:27017/assignment-eval
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
PORT=4000
```

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Running the Application

### Prerequisites
- Node.js 18+
- MongoDB running locally or accessible URI
- pnpm (or npm/yarn)

### Backend Setup

```bash
cd backend
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Start MongoDB (if local)
# mongod

# Run the backend
pnpm run start:dev
```

Backend will be available at: http://localhost:4000

### Frontend Setup

```bash
cd frontend
pnpm install

# Environment is already configured (.env.local)

# Run the frontend
pnpm run dev
```

Frontend will be available at: http://localhost:3000

## API Endpoints Used

### 1. POST /assignments
Creates a new assignment
```json
{
  "topic": "Essay on Climate Change",
  "instructions": "Write a 500-word essay...",
  "wordCount": 500,
  "mode": "strict"
}
```

### 2. GET /assignments
Fetches all assignments (used for history)

### 3. GET /assignments/:id
Fetches a single assignment

### 4. POST /assignments/:id/submissions/upload
Uploads PDF files (multipart/form-data)
- Field name: `files` (multiple files supported)
- Accepts: PDF only

### 5. POST /assignments/:id/evaluate
Starts the evaluation process

### 6. GET /assignments/:id/submissions
Fetches all submissions with their evaluation status

### 7. GET /assignments/:id/marks-sheet
Downloads the marks sheet
- Query param: `format` (xlsx or csv)

## Real-Time Updates

The frontend uses polling to provide real-time updates during evaluation:

1. After starting evaluation, the frontend polls `/assignments/:id/submissions` every 2 seconds
2. Updates the UI with the latest submission statuses
3. Stops polling when all submissions are evaluated or failed
4. Automatically navigates to results page when all submissions are complete

## Error Handling

- API errors are caught and displayed to the user
- Network errors show appropriate error messages
- Failed submissions are marked with "failed" status
- Loading states prevent duplicate API calls

## File Naming Convention

The frontend extracts student information from PDF filenames:
- Pattern: `StudentName_RollNumber.pdf`
- Example: `John_Doe_CS101.pdf`
- Parsed as: Name = "John Doe", Roll No = "CS101"

This is handled by `src/lib/parseStudent.ts`

## State Management

The `AssignmentContext` manages:
- Current assignment details
- Uploaded submissions (local files before upload)
- Assignment history
- Current assignment ID (from backend)
- Loading and error states

## Component Hierarchy

```
App
├── Layout
│   └── AssignmentProvider (Context)
│       ├── Dashboard (/)
│       ├── AssignmentForm (/assignment/setup)
│       ├── UploadPage (/assignment/upload)
│       │   └── FileUploader
│       ├── ProgressPage (/assignment/progress)
│       │   └── ProgressList
│       └── ResultsPage (/assignment/results)
│           ├── ResultsTable
│           └── DownloadButton
```

## Testing the Integration

1. **Start both servers**:
   - Backend: `cd backend && pnpm run start:dev`
   - Frontend: `cd frontend && pnpm run dev`

2. **Create an assignment**:
   - Go to http://localhost:3000
   - Click "Create New Assignment"
   - Fill in the form and submit

3. **Upload submissions**:
   - Drag and drop PDF files or click to select
   - Files should appear in the list

4. **Start evaluation**:
   - Click "Start Evaluation"
   - Watch the progress page update in real-time

5. **View results**:
   - Automatically redirected when complete
   - Download marks sheet in Excel or CSV format

## Troubleshooting

### Backend not responding
- Check if MongoDB is running
- Verify backend is running on port 4000
- Check backend console for errors

### CORS errors
- Verify CORS is enabled in `backend/src/main.ts`
- Check API URL in frontend `.env.local`

### Files not uploading
- Ensure files are PDFs
- Check file size (backend may have limits)
- Verify backend upload directory exists

### Evaluation stuck
- Check backend logs for evaluation errors
- Verify API keys are configured
- Check MongoDB connection

### Download not working
- Verify assignment has evaluated submissions
- Check backend can write to output directory
- Inspect network tab for API errors

## Production Deployment

### Backend
- Set proper CORS origins (remove `*`)
- Use environment variables for sensitive data
- Set up proper MongoDB instance
- Configure SSL/HTTPS
- Set appropriate rate limits

### Frontend
- Update `NEXT_PUBLIC_API_URL` to production backend URL
- Build: `pnpm run build`
- Deploy to Vercel, Netlify, or similar
- Ensure API URL is accessible from frontend domain

## Future Enhancements

- WebSocket integration for real-time updates (replace polling)
- File upload progress indicators
- Batch operations for multiple assignments
- User authentication and authorization
- Assignment templates
- Advanced filtering and search
- Export to multiple formats (PDF, etc.)
