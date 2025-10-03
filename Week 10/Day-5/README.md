# Assignment Evaluation System - Full Stack Application

A complete AI-powered assignment evaluation system with a modern web interface for uploading, evaluating, and managing student assignments.

## 🚀 Quick Start

```powershell
# 1. Install dependencies
cd backend && pnpm install
cd ../frontend && pnpm install

# 2. Configure backend environment
# Edit backend/.env with your API keys

# 3. Start both servers
cd ..
.\start.ps1

# 4. Open http://localhost:3000
```

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🎯 Overview

This system automates the process of evaluating student assignments using AI (OpenAI/Gemini). Teachers can:

1. Create assignments with specific criteria
2. Upload multiple student submissions (PDF)
3. Automatically evaluate all submissions
4. View detailed results and feedback
5. Export marks sheets in Excel or CSV format

The application features real-time progress tracking and smart student information extraction from filenames.

## ✨ Features

### Frontend (Next.js)
- 📝 **Assignment Creation**: Define topic, instructions, word count, and evaluation mode
- 📤 **Bulk Upload**: Drag-and-drop multiple PDF files
- 🔍 **Auto-Detection**: Extracts student names and roll numbers from filenames
- 📊 **Real-Time Progress**: Live updates during evaluation with progress bars
- 📈 **Results Dashboard**: View scores and feedback for all students
- 💾 **Export**: Download marks sheets in Excel (.xlsx) or CSV format
- 📜 **History**: Track all past assignments

### Backend (NestJS)
- 🤖 **AI Evaluation**: Uses OpenAI GPT or Google Gemini for intelligent grading
- 📄 **PDF Processing**: Extracts text from PDF submissions
- 🎯 **Dual Modes**: Strict or loose evaluation criteria
- 💾 **MongoDB**: Persistent storage for assignments and submissions
- 📊 **Excel Generation**: Creates formatted marks sheets
- 🔄 **RESTful API**: Clean, well-documented endpoints

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **File Upload**: react-dropzone
- **State**: React Context API

### Backend
- **Framework**: NestJS 11
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **AI APIs**: OpenAI GPT, Google Gemini
- **File Processing**: pdf-parse
- **Export**: ExcelJS

## 📁 Project Structure

```
Week 10/Day-5/
├── backend/                    # NestJS API Server
│   ├── src/
│   │   ├── assignments/       # Core assignment logic
│   │   ├── evaluation/        # AI evaluation service
│   │   ├── files/            # PDF & Excel processing
│   │   ├── common/           # Shared utilities
│   │   └── main.ts           # Application entry
│   ├── uploads/              # Uploaded PDF files
│   ├── output/               # Generated marks sheets
│   ├── .env                  # Environment config
│   └── package.json
│
├── frontend/                   # Next.js Web App
│   ├── src/
│   │   ├── app/              # Next.js app router pages
│   │   ├── components/       # Reusable React components
│   │   ├── context/          # React Context (state)
│   │   └── lib/              # API client & utilities
│   ├── .env.local            # Frontend environment
│   └── package.json
│
├── start.ps1                  # Quick start script
├── test-integration.ps1       # API testing script
├── SETUP_GUIDE.md            # Detailed setup instructions
├── INTEGRATION_GUIDE.md      # Technical integration docs
├── INTEGRATION_SUMMARY.md    # Integration overview
└── README.md                 # This file
```

## 🔧 Setup Instructions

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** (`npm install -g pnpm`)
- **MongoDB** ([Download](https://www.mongodb.com/try/download/community) or use [Atlas](https://www.mongodb.com/cloud/atlas))
- **OpenAI API Key** ([Get Key](https://platform.openai.com/api-keys))

### 1. Clone & Install

```powershell
# Navigate to project directory
cd "Week 10/Day-5"

# Install backend dependencies
cd backend
pnpm install

# Install frontend dependencies
cd ../frontend
pnpm install
```

### 2. Configure Backend

Create `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/assignment-eval
OPENAI_API_KEY=sk-your-openai-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here
PORT=4000
```

### 3. Start MongoDB

```powershell
# Start MongoDB service
mongod

# Or use MongoDB Atlas (cloud)
# Get connection string from Atlas dashboard
# Update MONGODB_URI in .env
```

### 4. Run the Application

#### Option A: Automatic (Recommended)

```powershell
# From project root
.\start.ps1
```

#### Option B: Manual

```powershell
# Terminal 1 - Backend
cd backend
pnpm run start:dev

# Terminal 2 - Frontend
cd frontend
pnpm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Docs**: See `backend/ENDPOINTS.md`

## 📖 Usage Guide

### Creating an Assignment

1. Open http://localhost:3000
2. Click **"Create New Assignment"**
3. Fill in the form:
   - **Title**: e.g., "Essay on Climate Change"
   - **Instructions**: Detailed assignment requirements
   - **Word Count**: Expected length (e.g., 500)
   - **Mode**: Choose "Strict" or "Loose" evaluation
4. Click **"Save & Continue to Upload"**

### Uploading Submissions

1. **Drag and drop** PDF files or click to select
2. **File Naming**: Use format `StudentName_RollNumber.pdf`
   - Example: `John_Doe_CS101.pdf`
   - Auto-extracts: Name = "John Doe", Roll = "CS101"
3. Review uploaded files
4. Remove any incorrect uploads
5. Click **"Start Evaluation"**

### Monitoring Progress

- Real-time progress bar shows completion
- Individual submission status updates live
- Automatically redirects when complete

### Viewing Results

- See scores (0-100) for each student
- Read AI-generated feedback
- **Download** marks sheet:
  - Excel format (.xlsx)
  - CSV format

## 📚 API Documentation

See detailed documentation:
- **Endpoints**: `backend/ENDPOINTS.md`
- **Full API Docs**: `backend/API_DOCUMENTATION.md`

### Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/assignments` | POST | Create assignment |
| `/assignments` | GET | List assignments |
| `/assignments/:id/submissions/upload` | POST | Upload PDFs |
| `/assignments/:id/evaluate` | POST | Start evaluation |
| `/assignments/:id/submissions` | GET | Get results |
| `/assignments/:id/marks-sheet` | GET | Download sheet |

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
```powershell
# Check if port 4000 is in use
netstat -ano | findstr :4000
# Kill the process if needed
taskkill /PID <PID> /F
```

**MongoDB connection error:**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- For Atlas, verify network access

**Frontend can't connect to backend:**
- Verify backend is running on port 4000
- Check `.env.local` has: `NEXT_PUBLIC_API_URL=http://localhost:4000`
- Test backend: http://localhost:4000

**Evaluation fails:**
- Verify OpenAI API key is valid
- Check API credits/quota
- Review backend console for errors

**Files won't upload:**
- Ensure files are PDFs (not images)
- Check file size limits
- Verify backend upload directory exists

### Testing

Test the API integration:
```powershell
.\test-integration.ps1
```

View logs:
- Backend: Console where `pnpm run start:dev` is running
- Frontend: Console where `pnpm run dev` is running
- Browser: DevTools Console (F12)

## 📄 Documentation Files

- **SETUP_GUIDE.md** - Comprehensive setup walkthrough
- **INTEGRATION_GUIDE.md** - Technical architecture details
- **INTEGRATION_SUMMARY.md** - Integration overview
- **backend/ENDPOINTS.md** - API endpoints reference
- **backend/API_DOCUMENTATION.md** - Detailed API docs

## 🔒 Security Notes

### Development
- CORS enabled for all origins
- No authentication required
- API keys in environment files

### Production Recommendations
- [ ] Enable authentication & authorization
- [ ] Restrict CORS to specific domains
- [ ] Use HTTPS/SSL
- [ ] Implement rate limiting
- [ ] Secure API keys with secrets manager
- [ ] Add input validation & sanitization
- [ ] Set up monitoring & logging

## 🚀 Deployment

### Backend (Railway/Render/Heroku)
1. Set environment variables
2. Connect MongoDB (use Atlas for cloud)
3. Deploy from GitHub
4. Note the deployed URL

### Frontend (Vercel/Netlify)
1. Update `NEXT_PUBLIC_API_URL` to production backend URL
2. Connect GitHub repository
3. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is for educational purposes.

## 🙏 Acknowledgments

- OpenAI for GPT API
- Google for Gemini API
- NestJS and Next.js communities

---

**Made with ❤️ for automated assignment evaluation**

For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

For technical details, see [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
