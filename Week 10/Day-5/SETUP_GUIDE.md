# Complete Setup and Integration Guide

This guide will help you set up and run the complete Assignment Evaluation System with frontend and backend integration.

## Quick Start (TL;DR)

```powershell
# 1. Install dependencies
cd backend && pnpm install && cd ../frontend && pnpm install && cd ..

# 2. Configure environment
# Edit backend/.env with your API keys

# 3. Start both servers
.\start.ps1

# 4. Open http://localhost:3000
```

## Detailed Setup Instructions

### Step 1: Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher)
  - Download from: https://nodejs.org/
  - Verify: `node --version`

- **pnpm** (Package manager)
  - Install: `npm install -g pnpm`
  - Verify: `pnpm --version`

- **MongoDB** (Database)
  - Download from: https://www.mongodb.com/try/download/community
  - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas
  - Verify: `mongod --version`

### Step 2: Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Install dependencies
pnpm install

# Create environment file
# Copy .env.example to .env (if exists) or create new .env file
# Add the following variables:

# MONGODB_URI=mongodb://localhost:27017/assignment-eval
# OPENAI_API_KEY=your_openai_api_key_here
# GEMINI_API_KEY=your_gemini_api_key_here (optional)
# PORT=4000
```

#### Get API Keys:

**OpenAI API Key:**
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste into `.env` file

**Gemini API Key (Optional):**
1. Go to https://makersuite.google.com/app/apikey
2. Create API key
3. Copy and paste into `.env` file

### Step 3: Frontend Setup

```powershell
# Navigate to frontend directory
cd ../frontend

# Install dependencies
pnpm install

# Environment file (.env.local) is already created
# It should contain:
# NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Step 4: Start MongoDB

#### Option A: Local MongoDB
```powershell
# Start MongoDB service
mongod

# Or on Windows, MongoDB might be running as a service already
# Check Services (services.msc) for "MongoDB"
```

#### Option B: MongoDB Atlas
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Update `MONGODB_URI` in backend/.env

### Step 5: Start the Servers

#### Option A: Automatic Start (Recommended)
```powershell
# From the root directory
.\start.ps1
```

This will:
- Check if MongoDB is running
- Start backend server on port 4000
- Start frontend server on port 3000
- Open two terminal windows

#### Option B: Manual Start

**Terminal 1 - Backend:**
```powershell
cd backend
pnpm run start:dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
pnpm run dev
```

### Step 6: Verify Integration

#### Test Backend API
```powershell
# From root directory
.\test-integration.ps1
```

This script will:
- Check backend health
- Create a test assignment
- Verify API endpoints
- Display results

#### Test Frontend
1. Open browser to http://localhost:3000
2. You should see the dashboard
3. Click "Create New Assignment"

## Using the Application

### 1. Create an Assignment

1. Click "Create New Assignment" on the dashboard
2. Fill in the form:
   - **Assignment Title**: e.g., "Essay on Climate Change"
   - **Instructions**: Detailed requirements for the essay
   - **Expected Word Count**: e.g., 500
   - **Evaluation Mode**: 
     - **Strict**: More critical evaluation
     - **Loose**: More lenient evaluation
3. Click "Save & Continue to Upload"

### 2. Upload Student Submissions

1. Drag and drop PDF files or click to select
2. Files should be named: `StudentName_RollNumber.pdf`
   - Example: `John_Doe_CS101.pdf`
   - This will auto-extract: Name = "John Doe", Roll = "CS101"
3. Review the uploaded files
4. Remove any incorrect uploads
5. Click "Start Evaluation"

### 3. Monitor Progress

- The system will automatically:
  - Upload files to backend
  - Start AI evaluation
  - Poll for updates every 2 seconds
  - Show real-time progress
- Progress bar shows completion percentage
- Individual submission status updates in real-time

### 4. View Results

- After all submissions are evaluated:
  - Automatically redirected to results page
  - View scores and feedback for each student
  - Download marks sheet in Excel or CSV format

## File Naming Convention

For automatic student information extraction, name files as:

```
StudentName_RollNumber.pdf
```

**Examples:**
- ✓ `John_Doe_CS101.pdf` → Name: "John Doe", Roll: "CS101"
- ✓ `Alice_Smith_EE202.pdf` → Name: "Alice Smith", Roll: "EE202"
- ✓ `Bob_CS303.pdf` → Name: "Bob", Roll: "CS303"
- ✗ `submission1.pdf` → Name: "Unknown", Roll: "N/A"

## Troubleshooting

### Backend won't start

**Problem:** Port 4000 already in use
```powershell
# Find and kill process using port 4000
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

**Problem:** MongoDB connection error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- For Atlas, verify network access settings

**Problem:** Missing API keys
- Verify `OPENAI_API_KEY` is set in `.env`
- Check key is valid and has credits

### Frontend won't start

**Problem:** Port 3000 already in use
```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Problem:** Cannot connect to backend
- Verify backend is running on port 4000
- Check `.env.local` has correct API URL
- Test backend: http://localhost:4000

### Upload/Evaluation Issues

**Problem:** Files won't upload
- Ensure files are PDFs (not images or other formats)
- Check file size (may have limits)
- Verify backend upload directory exists

**Problem:** Evaluation fails
- Check backend logs for errors
- Verify API keys are valid
- Check OpenAI API credits/quota
- Ensure MongoDB is accessible

**Problem:** Stuck on "Processing"
- Check backend console for errors
- Verify evaluation service is working
- Try with a smaller test file

### Download Issues

**Problem:** Download button disabled
- Ensure evaluation is complete
- Verify assignment ID exists
- Check backend is running

**Problem:** Download fails
- Check backend output directory permissions
- Verify assignment has evaluated submissions
- Check network tab in browser DevTools

## API Endpoints Reference

All endpoints are prefixed with `http://localhost:4000`

### Assignments
- `POST /assignments` - Create assignment
- `GET /assignments` - List all assignments
- `GET /assignments/:id` - Get single assignment

### Submissions
- `POST /assignments/:id/submissions/upload` - Upload PDFs
- `GET /assignments/:id/submissions` - List submissions
- `POST /assignments/:id/evaluate` - Start evaluation

### Export
- `GET /assignments/:id/marks-sheet?format=xlsx` - Download Excel
- `GET /assignments/:id/marks-sheet?format=csv` - Download CSV

## Project Structure

```
Week 10/Day-5/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── assignments/       # Assignment & Submission logic
│   │   ├── evaluation/        # AI evaluation service
│   │   ├── files/            # Excel/PDF services
│   │   └── common/           # Utilities
│   ├── uploads/              # Uploaded PDFs
│   ├── output/               # Generated marks sheets
│   └── .env                  # Environment variables
│
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/              # Pages
│   │   ├── components/       # React components
│   │   ├── context/          # State management
│   │   └── lib/              # API & utilities
│   └── .env.local            # Frontend environment
│
├── start.ps1                  # Quick start script
├── test-integration.ps1       # API test script
└── INTEGRATION_GUIDE.md       # This guide
```

## Development Tips

### Backend Development
```powershell
# Watch mode (auto-reload)
cd backend
pnpm run start:dev

# View logs
# Logs appear in the terminal

# Test database connection
pnpm run test:mongo
```

### Frontend Development
```powershell
# Development mode (auto-reload)
cd frontend
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm run start
```

### Database Management

```powershell
# Connect to MongoDB
mongosh

# Use the database
use assignment-eval

# View collections
show collections

# View assignments
db.assignments.find().pretty()

# View submissions
db.submissions.find().pretty()

# Clear all data (CAREFUL!)
db.assignments.deleteMany({})
db.submissions.deleteMany({})
```

## Production Deployment

### Backend Deployment
1. Build: `pnpm run build`
2. Set environment variables on hosting platform
3. Ensure MongoDB is accessible
4. Update CORS settings for production domain
5. Deploy to: Railway, Render, Heroku, etc.

### Frontend Deployment
1. Update `NEXT_PUBLIC_API_URL` to production backend URL
2. Build: `pnpm run build`
3. Deploy to: Vercel, Netlify, etc.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review backend and frontend logs
3. Test individual API endpoints
4. Check browser console for errors

## Next Steps

After successful setup:
1. Create test assignments with sample PDFs
2. Experiment with different evaluation modes
3. Test with various file naming patterns
4. Try downloading different export formats
5. Monitor API usage and performance

---

**Congratulations!** Your Assignment Evaluation System is now fully integrated and ready to use! 🎉
