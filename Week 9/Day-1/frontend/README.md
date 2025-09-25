# Research Workflow Assistant - Frontend

A Next.js frontend application for the Research Workflow Assistant, built with TypeScript and Tailwind CSS.

## Features

- **Responsive Design**: Mobile-first responsive design that works on all devices
- **Real-time Updates**: Live updates of workflow progress using SWR
- **Interactive Timeline**: Step-by-step visualization of the research workflow
- **Copy to Clipboard**: Easy copying of final answers
- **Question History**: View all previous research questions and results
- **TypeScript**: Full type safety throughout the application
- **Modern UI**: Clean, modern interface with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: SWR for real-time data updates
- **HTTP Client**: Axios
- **Icons**: Heroicons
- **Fonts**: Geist (Sans & Mono)

## Pages

### Home Page (`/`)
- Landing section with app description
- Question submission form
- Mode selection (LLM/Code)
- Features overview

### Results Page (`/results/[traceId]`)
- Live workflow progress tracking
- Step-by-step timeline view
- Final answer display with copy functionality
- Real-time status updates

### History Page (`/history`)
- List of all previous questions
- Quick access to results
- Chronological ordering

## Components

### Core Components
- `QuestionForm`: Form for submitting research questions
- `TraceViewer`: Timeline display of workflow steps
- `AnswerCard`: Display final answers with copy functionality
- `Navbar`: Navigation component

### Utility Components
- `LoadingSpinner`: Loading indicators
- `ErrorDisplay`: Error state displays
- `SWRProvider`: Data fetching configuration

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Backend server running on port 4000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env.local
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

## API Integration

The frontend integrates with the NestJS backend through the following endpoints:

- `POST /workflow/run` - Submit research questions
- `GET /traces/:traceId` - Get workflow progress
- `GET /answers/:answerId` - Get final answers
- `GET /questions` - Get question history

## Data Flow

1. User submits question through `QuestionForm`
2. Question sent to backend via `workflowApi.runWorkflow()`
3. User redirected to results page with `traceId`
4. Results page polls trace endpoint for live updates
5. Final answer displayed when workflow completes

## Responsive Design

The application follows a mobile-first approach:

- **Mobile**: Stacked layout, simplified navigation
- **Tablet**: Grid layouts, expanded content
- **Desktop**: Full timeline view, multi-column layouts

## TypeScript Types

All API responses and component props are fully typed:

- `Question`: Research question data
- `Answer`: Final answer data  
- `Trace`: Workflow execution data
- `TraceStep`: Individual workflow steps

## Error Handling

- Network errors with retry functionality
- Loading states for all async operations
- User-friendly error messages
- Graceful degradation for failed requests

## Performance Features

- SWR for efficient data fetching and caching
- Real-time updates without excessive polling
- Optimized re-rendering with React hooks
- Code splitting with Next.js App Router

## Deployment

The application can be deployed to:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Self-hosted** with Docker

Make sure to configure the `NEXT_PUBLIC_API_URL` environment variable to point to your deployed backend.
