# Quick Start Guide

## Installation & Setup

### 1. Install Dependencies

```bash
pnpm install
```

This will install all required packages including:
- NestJS framework
- pdf-parse (PDF text extraction)
- exceljs (Excel file generation)
- axios (HTTP client for Gemini API)
- uuid (unique ID generation)
- multer (file upload handling)

### 2. Configure Environment

Create a `.env` file in the backend root directory:

```env
PORT=4000
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
OUTPUT_DIR=./output
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
MAX_WORD_COUNT=5000
```

**Get your Gemini API Key:**
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy and paste it into the `.env` file

### 3. Run the Application

**Development mode (with auto-reload):**
```bash
pnpm run start:dev
```

**Production mode:**
```bash
pnpm run build
pnpm run start:prod
```

The server will start on http://localhost:4000

## Quick Test

### Using cURL (PowerShell):

```powershell
# 1. Create an assignment
$response = curl.exe -X POST http://localhost:4000/assignments `
  -H "Content-Type: application/json" `
  -d '{\"topic\":\"Test Essay\",\"instructions\":\"Write about AI\",\"wordCount\":300,\"mode\":\"loose\"}'

# 2. Get all assignments
curl.exe http://localhost:4000/assignments
```

### Using Browser:

Open http://localhost:4000/assignments in your browser to see all assignments.

## Next Steps

1. Read `API_DOCUMENTATION.md` for complete API reference
2. Read `TESTING_GUIDE.md` for detailed testing instructions
3. Create sample PDFs with student submissions
4. Test the complete workflow

## Project Structure

```
backend/
├── src/
│   ├── assignments/         # Assignment management
│   │   ├── dto/            # Data transfer objects
│   │   ├── entities/       # Data models
│   │   ├── *.controller.ts # API endpoints
│   │   ├── *.service.ts    # Business logic
│   │   └── *.module.ts     # Module definition
│   ├── evaluation/         # AI evaluation service
│   │   ├── evaluation.service.ts
│   │   └── prompt-templates.ts
│   ├── files/              # File processing
│   │   ├── pdf.service.ts
│   │   └── excel.service.ts
│   ├── common/             # Shared utilities
│   │   ├── constants.ts
│   │   ├── types.ts
│   │   └── utils/
│   └── main.ts             # Application entry
├── output/                 # Generated Excel/CSV files
├── .env                    # Environment variables
└── package.json            # Dependencies
```

## Implemented Features

✅ **Create assignments** with instructions and evaluation criteria
✅ **Upload multiple PDFs** simultaneously
✅ **Extract text** from PDFs automatically
✅ **Detect student info** (name & roll number) from PDF content
✅ **AI evaluation** using Gemini API with customizable prompts
✅ **Generate Excel/CSV** marks sheets
✅ **Strict vs Loose** evaluation modes
✅ **Complete error handling** and validation
✅ **RESTful API** with proper HTTP status codes

## Troubleshooting

**Server won't start:**
- Run `pnpm install` first
- Check if port 4000 is already in use

**"Cannot find module" errors:**
- Delete `node_modules` and run `pnpm install` again

**Gemini API errors:**
- Verify API key is correct in `.env`
- Check internet connection
- Ensure you're not hitting rate limits

**PDF upload fails:**
- Only PDF files are accepted
- Check file size is under 10MB
- Ensure PDFs contain actual text, not scanned images

## Support

For issues or questions:
1. Check the error messages in the console
2. Review `API_DOCUMENTATION.md` and `TESTING_GUIDE.md`
3. Ensure all environment variables are set correctly
