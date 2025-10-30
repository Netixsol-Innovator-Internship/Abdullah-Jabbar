// src/common/utils/gemini-client.ts
import * as dotenv from 'dotenv';
dotenv.config(); // must come before process.env access

import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY not set in .env');
}

// Create Gemini client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Use Gemini Flash 2.0 (fast, optimized for real-time interactions)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

/**
 * Minimal Gemini wrapper using SDK
 */
export async function callGemini(
  prompt: string,
  system = 'You are a helpful research assistant',
): Promise<string> {
  const result = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [{ text: `${system}\n\n${prompt}` }],
      },
    ],
  });

  return result.response.text();
}
