# CV Generator Frontend

A Next.js frontend application for generating professional CVs.

## Features

- Interactive CV form builder
- Real-time preview
- PDF and Word document generation
- Responsive design
- Rich text editing

## Environment Variables

Set the following environment variables:

```env
NEXT_PUBLIC_API_URL=your-backend-api-url
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your API URL
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

### Automatic Deployment

1. Fork this repository
2. Connect your GitHub account to Vercel
3. Import this project on Vercel
4. Set the environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL

### Manual Deployment

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables:
```bash
vercel env add NEXT_PUBLIC_API_URL
```

## Build for Production

```bash
npm run build
npm start
```

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- React Quill (Rich text editor)
- Heroicons
