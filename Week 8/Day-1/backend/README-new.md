# CV Generator Backend

A NestJS backend API for generating PDF and Word documents from CV templates.

## Features

- PDF generation using Puppeteer
- Word document generation using docx library
- Template-based rendering with Handlebars
- Static template serving
- CORS enabled for cross-origin requests

## API Endpoints

- `POST /api/cv/generate` - Generate PDF (default)
- `POST /api/cv/generate?format=docx` - Generate Word document
- `POST /api/cv/preview` - Get rendered HTML preview
- `GET /template/*` - Serve static template files

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. The server will start on [http://localhost:4000](http://localhost:4000)

## Deployment on Vercel

### Automatic Deployment

1. Fork this repository
2. Connect your GitHub account to Vercel
3. Import this project on Vercel
4. Vercel will automatically detect it as a Node.js project

### Manual Deployment

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

## Project Structure

```
src/
├── cv/
│   ├── cv.controller.ts    # API endpoints
│   ├── cv.service.ts       # Business logic
│   └── cv.module.ts        # Module definition
├── app.module.ts           # Root module
└── main.ts                 # Application entry point

templates/
├── template.html           # CV template
├── template.css           # Template styles
└── tokens.json            # Template tokens

api/
├── index.ts               # Serverless entry point
└── template/
    └── [...path].ts       # Template file handler
```

## Technologies Used

- NestJS
- TypeScript
- Puppeteer (PDF generation)
- docx (Word document generation)
- Handlebars (Template rendering)
- sanitize-html (HTML sanitization)

## Build for Production

```bash
npm run build
npm run start:prod
```