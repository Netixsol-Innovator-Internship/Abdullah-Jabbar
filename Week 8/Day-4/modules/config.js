import * as dotenv from "dotenv";
dotenv.config();

export const GOOGLE_API_KEY = 
  process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || null;
export const MODEL = process.env.GOOGLE_MODEL || "gemini-2.0-flash";
export const systemMessage = {
  role: "system",
  content: "You are a helpful assistant.",
};