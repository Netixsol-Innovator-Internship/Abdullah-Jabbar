# Testing Guide - NestJS AI Assignment Checker

This guide provides step-by-step instructions to test the API using cURL commands.

## Prerequisites

1. Install dependencies: `pnpm install`
2. Set up `.env` file with your Gemini API key
3. Start the server: `pnpm run start:dev`
4. Server should be running on http://localhost:4000

## Test Workflow

### Step 1: Create an Assignment

```bash
curl -X POST http://localhost:4000/assignments \
  -H "Content-Type: application/json" \
  -d "{\"topic\":\"Climate Change Essay\",\"instructions\":\"Write a comprehensive essay on the impacts of climate change on global ecosystems. Include scientific evidence and real-world examples.\",\"wordCount\":500,\"mode\":\"strict\"}"
```

**Expected Response:**
```json
{
  "statusCode": 201,
  "message": "Assignment created successfully",
  "data": {
    "id": "generated-uuid-here",
    "topic": "Climate Change Essay",
    "instructions": "Write a comprehensive essay...",
    "wordCount": 500,
    "mode": "strict",
    "createdAt": "2025-10-03T..."
  }
}
```

**Save the assignment ID** from the response - you'll need it for the next steps!

### Step 2: Get All Assignments

```bash
curl http://localhost:4000/assignments
```

### Step 3: Create Sample PDF Submissions

Before uploading, create sample PDF files with student submissions. Each PDF should start with:

```
Name: John Doe
Roll Number: 12345

[Essay content here...]
```

You can create PDFs manually or use the sample PDFs in the test folder.

### Step 4: Upload Submissions

Replace `{ASSIGNMENT_ID}` with your actual assignment ID from Step 1:

**Windows PowerShell:**
```powershell
curl.exe -X POST http://localhost:4000/assignments/{ASSIGNMENT_ID}/submissions/upload `
  -F "files=@student1.pdf" `
  -F "files=@student2.pdf" `
  -F "files=@student3.pdf"
```

**Linux/Mac:**
```bash
curl -X POST http://localhost:4000/assignments/{ASSIGNMENT_ID}/submissions/upload \
  -F "files=@student1.pdf" \
  -F "files=@student2.pdf" \
  -F "files=@student3.pdf"
```

**Expected Response:**
```json
{
  "statusCode": 201,
  "message": "3 submission(s) uploaded successfully",
  "data": [
    {
      "id": "submission-uuid-1",
      "assignmentId": "assignment-uuid",
      "studentName": "John Doe",
      "rollNumber": "12345",
      "rawText": "Extracted text from PDF...",
      "status": "pending",
      "createdAt": "..."
    },
    ...
  ]
}
```

### Step 5: View Assignment with Submissions

```bash
curl http://localhost:4000/assignments/{ASSIGNMENT_ID}
```

This shows the assignment and all its submissions (status should be "pending").

### Step 6: Evaluate Submissions

This will send each submission to Gemini AI for evaluation:

```bash
curl -X POST http://localhost:4000/assignments/{ASSIGNMENT_ID}/evaluate
```

**Note:** This may take 10-30 seconds depending on the number of submissions.

**Expected Response:**
```json
{
  "statusCode": 200,
  "message": "3 submission(s) evaluated successfully",
  "data": [
    {
      "id": "submission-uuid-1",
      "assignmentId": "assignment-uuid",
      "studentName": "John Doe",
      "rollNumber": "12345",
      "rawText": "...",
      "score": 85,
      "remarks": "Well-written essay with good examples. Strong understanding of the topic. Minor grammatical issues noted.",
      "status": "evaluated",
      "createdAt": "..."
    },
    ...
  ]
}
```

### Step 7: Get Updated Submissions

```bash
curl http://localhost:4000/assignments/{ASSIGNMENT_ID}/submissions
```

All submissions should now have scores and remarks.

### Step 8: Download Marks Sheet (Excel)

**Windows PowerShell:**
```powershell
curl.exe -O -J http://localhost:4000/assignments/{ASSIGNMENT_ID}/marks-sheet?format=xlsx
```

**Linux/Mac:**
```bash
curl -O -J http://localhost:4000/assignments/{ASSIGNMENT_ID}/marks-sheet?format=xlsx
```

This downloads an Excel file with all the results.

### Step 9: Download Marks Sheet (CSV)

```bash
curl -O -J http://localhost:4000/assignments/{ASSIGNMENT_ID}/marks-sheet?format=csv
```

## Testing with Postman

### 1. Create Assignment
- Method: POST
- URL: `http://localhost:4000/assignments`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "topic": "Climate Change Essay",
  "instructions": "Write about climate change",
  "wordCount": 500,
  "mode": "strict"
}
```

### 2. Upload Submissions
- Method: POST
- URL: `http://localhost:4000/assignments/{ASSIGNMENT_ID}/submissions/upload`
- Body: form-data
  - Key: `files` (type: File, select multiple PDFs)

### 3. Evaluate
- Method: POST
- URL: `http://localhost:4000/assignments/{ASSIGNMENT_ID}/evaluate`

### 4. Download Marks Sheet
- Method: GET
- URL: `http://localhost:4000/assignments/{ASSIGNMENT_ID}/marks-sheet?format=xlsx`
- Click "Send and Download"

## Sample PDF Structure

Create a test PDF with this structure:

```
Name: John Doe
Roll Number: CS2023-001

Climate Change: A Global Challenge

Climate change represents one of the most pressing challenges facing humanity today. 
The phenomenon, driven primarily by anthropogenic greenhouse gas emissions, has far-reaching 
implications for ecosystems, weather patterns, and human societies worldwide.

Scientific evidence overwhelmingly demonstrates that global temperatures have risen by 
approximately 1.1°C since pre-industrial times. This warming has triggered cascading effects 
including rising sea levels, more frequent extreme weather events, and disruptions to 
natural habitats.

[Continue for ~500 words...]
```

## Troubleshooting

### Error: "No files uploaded"
- Ensure you're using `-F` flag with curl (not `-d`)
- Check file paths are correct
- Verify files exist

### Error: "Only PDF files are allowed"
- Ensure all uploaded files are PDFs
- Check file extensions

### Error: "Assignment not found"
- Verify the assignment ID is correct
- Check if assignment was created successfully

### Error: "Failed to evaluate submission"
- Verify GEMINI_API_KEY is set in .env
- Check internet connection
- Verify API key is valid

### Error: "Failed to extract text from PDF"
- Ensure PDF contains actual text (not scanned images)
- Try a different PDF
- Check PDF is not corrupted

## Example Complete Test Script

Here's a complete bash script to test the entire workflow:

```bash
#!/bin/bash

# Set base URL
BASE_URL="http://localhost:4000"

echo "Step 1: Creating assignment..."
RESPONSE=$(curl -s -X POST $BASE_URL/assignments \
  -H "Content-Type: application/json" \
  -d '{"topic":"Test Assignment","instructions":"Write about climate change","wordCount":500,"mode":"strict"}')

ASSIGNMENT_ID=$(echo $RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "Assignment created with ID: $ASSIGNMENT_ID"

echo -e "\nStep 2: Uploading submissions..."
curl -X POST $BASE_URL/assignments/$ASSIGNMENT_ID/submissions/upload \
  -F "files=@student1.pdf" \
  -F "files=@student2.pdf"

echo -e "\nStep 3: Evaluating submissions..."
curl -X POST $BASE_URL/assignments/$ASSIGNMENT_ID/evaluate

echo -e "\nStep 4: Getting results..."
curl $BASE_URL/assignments/$ASSIGNMENT_ID

echo -e "\nStep 5: Downloading marks sheet..."
curl -O -J "$BASE_URL/assignments/$ASSIGNMENT_ID/marks-sheet?format=xlsx"

echo -e "\nWorkflow completed!"
```

Save as `test-workflow.sh` and run with: `bash test-workflow.sh`

## Expected File Outputs

After running the tests, you should have:
- Excel/CSV files in the `output/` directory
- Each file named like: `marks_sheet_Test_Assignment_2025-10-03T12-30-45.xlsx`

## API Response Codes

- **200 OK**: Successful GET/POST request
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid input or file type
- **404 Not Found**: Assignment/submission not found
- **500 Internal Server Error**: Server error (check logs)

## Notes

1. Replace `{ASSIGNMENT_ID}` with actual ID from create assignment response
2. Ensure PDF files exist before uploading
3. Wait for evaluation to complete before downloading marks sheet
4. Check console logs for detailed error messages
