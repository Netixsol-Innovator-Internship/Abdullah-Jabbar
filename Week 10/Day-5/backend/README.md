# NestJS AI Assignment Checker

A complete NestJS backend application for AI-powered assignment evaluation using Google's Gemini API.

## 🎯 Features

- ✅ **Create Assignments** with detailed instructions and evaluation criteria
- ✅ **Upload Multiple PDFs** with automatic text extraction
- ✅ **Auto-detect Student Info** from PDF content (name & roll number)
- ✅ **AI Evaluation** using Google Gemini API with customizable prompts
- ✅ **Strict vs Loose Modes** for different grading approaches
- ✅ **Excel/CSV Export** for downloadable marks sheets
- ✅ **RESTful API** with comprehensive error handling

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- pnpm package manager
- Google Gemini API key

### Installation

```bash
# Install dependencies
pnpm install

# Configure environment
# Create .env file and add your GEMINI_API_KEY

# Run the application
pnpm run start:dev
```

The server will start on http://localhost:4000

### Get Gemini API Key
1. Visit https://makersuite.google.com/app/apikey
2. Create a new API key
3. Add it to your `.env` file

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Setup and quick start guide
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Testing instructions with cURL examples
- **[SAMPLE_SUBMISSION_FORMAT.md](./SAMPLE_SUBMISSION_FORMAT.md)** - PDF format guidelines
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Implementation details

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── assignments/         # Assignment management module
│   ├── evaluation/          # AI evaluation service
│   ├── files/              # PDF & Excel processing
│   ├── common/             # Shared utilities & types
│   └── main.ts             # Application entry point
├── output/                 # Generated Excel/CSV files
├── .env                    # Environment configuration
└── package.json            # Dependencies
```

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/assignments` | Create new assignment |
| GET | `/assignments` | Get all assignments |
| GET | `/assignments/:id` | Get assignment with submissions |
| POST | `/assignments/:id/submissions/upload` | Upload PDF submissions |
| POST | `/assignments/:id/evaluate` | Evaluate with AI |
| GET | `/assignments/:id/marks-sheet` | Download marks sheet |

## 💡 Usage Example

```bash
# 1. Create an assignment
curl -X POST http://localhost:4000/assignments \
  -H "Content-Type: application/json" \
  -d '{"topic":"Climate Essay","instructions":"Write about climate change","wordCount":500,"mode":"strict"}'

# 2. Upload student PDFs
curl -X POST http://localhost:4000/assignments/{id}/submissions/upload \
  -F "files=@student1.pdf" \
  -F "files=@student2.pdf"

# 3. Evaluate submissions
curl -X POST http://localhost:4000/assignments/{id}/evaluate

# 4. Download marks sheet
curl -O -J http://localhost:4000/assignments/{id}/marks-sheet?format=xlsx
```

## 🎓 Evaluation Modes

### Strict Mode
- Critical grading (0-100 score range)
- Strict word count enforcement (±10% tolerance)
- Heavily penalizes off-topic content
- Evaluates structure, grammar, coherence

### Loose Mode
- Encouraging grading (40-100 score range)
- Flexible word count (±30% tolerance)
- Credits effort and understanding
- Focuses on core concepts

## 🛠️ Technologies

- **NestJS** - Backend framework
- **pdf-parse** - PDF text extraction
- **exceljs** - Excel file generation
- **axios** - HTTP client for Gemini API
- **Gemini API** - AI evaluation
- **TypeScript** - Type safety

## 🔒 Environment Variables

Required in `.env`:

```env
PORT=4000
GEMINI_API_KEY=your_api_key_here
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
OUTPUT_DIR=./output
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
MAX_WORD_COUNT=5000
```

## 📝 PDF Submission Format

Students should format their PDFs like:

```
Name: John Doe
Roll Number: 12345

[Essay content here...]
```

See [SAMPLE_SUBMISSION_FORMAT.md](./SAMPLE_SUBMISSION_FORMAT.md) for more details.

## ⚠️ Important Notes

1. **In-Memory Storage**: Currently uses Map for data storage. For production, integrate a database.
2. **API Key**: Gemini API key is required for AI evaluation to work.
3. **File Size**: PDFs must be under 10MB.
4. **PDF Format**: Only text-based PDFs are supported (not scanned images).

## 👨‍💻 Implementation

This is a complete implementation with:
- ✅ All services fully implemented (no empty stubs)
- ✅ Real PDF extraction with pdf-parse
- ✅ Real AI evaluation with Gemini API
- ✅ Real Excel generation with exceljs
- ✅ Comprehensive error handling
- ✅ Full TypeScript typing
- ✅ Complete documentation

For implementation details, see [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

## 📄 License

UNLICENSED
