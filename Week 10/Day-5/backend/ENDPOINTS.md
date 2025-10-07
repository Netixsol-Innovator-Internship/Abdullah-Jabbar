# API Endpoints — Methods, URLs and Request Bodies

Base URL (assumed): `http://localhost:3000`

Below are the available endpoints found in `src/assignments/assignments.controller.ts` and `src/app.controller.ts`.

## 1) GET /
- Method: GET
- URL: `/`
- Body: none

## 2) POST /assignments
- Method: POST
- URL: `/assignments`
- Content-Type: `application/json`
- Body (CreateAssignmentDto):

```json
{
  "topic": "Opinion Essay on Climate Change",
  "instructions": "Write a 600-800 word opinion essay. Cite at least 2 sources.",
  "wordCount": 700,
  "mode": "strict"
}
```

Notes: `mode` must be either `"strict"` or `"loose"`.

## 3) GET /assignments
- Method: GET
- URL: `/assignments`
- Body: none

## 4) GET /assignments/:id
- Method: GET
- URL: `/assignments/{id}`
- Path param: `id` (assignment id)
- Body: none

Example: `/assignments/634a1b2c`

## 5) POST /assignments/:id/submissions/upload
- Method: POST
- URL: `/assignments/{id}/submissions/upload`
- Content-Type: `multipart/form-data`
- File field name: `files` (controller uses `FilesInterceptor('files', 50)`) — can upload multiple files with the same field name.
- Allowed file type: PDF only (`application/pdf`). Non-PDF files will be rejected.

Example multipart fields:
- files: (binary) `student1_submission.pdf`
- files: (binary) `student2_submission.pdf`
- optional form fields (if used by your service): `studentName`, `rollNumber`

Example curl (for reference):

```bash
curl -X POST "http://localhost:3000/assignments/634a1b2c/submissions/upload" \
  -F "files=@/path/to/student1_submission.pdf" \
  -F "files=@/path/to/student2_submission.pdf" \
  -F "studentName=Alice" \
  -F "rollNumber=CS101-01"
```

Edge cases to test:
- No files -> expect 400 Bad Request (controller throws `BadRequestException('No files uploaded')`).
- Non-PDF files -> expect 400 Bad Request listing invalid files.

## 6) POST /assignments/:id/evaluate
- Method: POST
- URL: `/assignments/{id}/evaluate`
- Body: none

Purpose: evaluate all pending submissions for the assignment. Returns evaluated submissions.

## 7) GET /assignments/:id/submissions
- Method: GET
- URL: `/assignments/{id}/submissions`
- Body: none

Purpose: list all submissions for the assignment.

## 8) GET /assignments/:id/marks-sheet
- Method: GET
- URL: `/assignments/{id}/marks-sheet`
- Query param: `format` (optional) — `xlsx` (default) or `csv`
- Example: `/assignments/634a1b2c/marks-sheet?format=csv`
- Response: file stream. Controller sets Content-Type and Content-Disposition and streams the generated file.

Invalid format (not `xlsx` or `csv`) -> 400 Bad Request.

---

Quick test checklist
- Create assignment (POST `/assignments`) with valid JSON → expect 201 Created.
- List assignments (GET `/assignments`) → expect 200 OK.
- Upload PDFs (POST `/assignments/{id}/submissions/upload`) using `files` field → expect 201 Created.
- Attempt upload with non-PDF → expect 400.
- Evaluate (POST `/assignments/{id}/evaluate`) → expect 200 with evaluated items.
- Download marks sheet (GET `/assignments/{id}/marks-sheet?format=xlsx`) → expect file stream.

If you want, I can also generate a ready-made Postman collection or a PowerShell script containing these calls.
