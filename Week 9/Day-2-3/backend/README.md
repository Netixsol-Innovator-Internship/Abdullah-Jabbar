# Cricket QA Backend (Nest.js + MongoDB)

A minimal Nest.js backend that implements a LangGraph-like workflow using Gemini Flash 2.0 (stubbed) to answer cricket match stats questions.

## Features
- `POST /ask` — Ask natural language questions about cricket matches. Workflow:
  1. Relevancy check (keyword + Gemini hybrid)
  2. Query generation (Gemini stub returns structured JSON)
  3. Server-side validation & sanitization
  4. Execute against `matches` collection (Mongoose)
  5. Format as text or table JSON and return together with sanitized query metadata

- `POST /upload` — Upload a CSV of matches (multipart form-data `file` + `format` field `test|odi|t20`). CSV is parsed, normalized, and upserted into `matches`. Idempotent via deterministic upsert key.

## Folder layout
(See repository tree in README header)

## Run
1. Install:
   ```bash
   npm install
