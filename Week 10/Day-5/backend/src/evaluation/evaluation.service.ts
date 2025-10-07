import { Injectable, BadRequestException } from '@nestjs/common';
import { fillPromptTemplate } from './prompt-templates';
import axios from 'axios';
import { EvaluationResult } from '../common/types';
import { Assignment } from '../assignments/entities/assignment.entity';
import { Submission } from '../assignments/entities/submission.entity';

@Injectable()
export class EvaluationService {
  constructor() {
    // No-op constructor. GEMINI_API_KEY will be read at call time to ensure
    // environment variables are loaded (dotenv is imported in main.ts).
  }

  async evaluate(
    assignment: Assignment,
    submission: Submission,
  ): Promise<EvaluationResult> {
    try {
      // Fill the prompt template with assignment and submission data
      const prompt = fillPromptTemplate(assignment, submission);

      // Call Gemini API
      const response = await this.callGeminiAPI(prompt);

      // Parse the JSON response
      const result = this.parseEvaluationResponse(response);

      // Validate the result
      if (
        !result.studentName ||
        !result.rollNumber ||
        typeof result.score !== 'number' ||
        !result.remarks
      ) {
        throw new Error('Invalid evaluation result structure');
      }

      // Ensure score is within valid range
      result.score = Math.max(0, Math.min(100, result.score));

      return result;
    } catch (error) {
      console.error('Error evaluating submission:', error);
      throw new BadRequestException(
        `Failed to evaluate submission: ${error.message}`,
      );
    }
  }

  private async callGeminiAPI(prompt: string): Promise<string> {
    try {
      const geminiApiKey = process.env.GEMINI_API_KEY;
      const geminiApiUrl =
        process.env.GEMINI_API_URL ||
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

      if (!geminiApiKey) {
        throw new Error('GEMINI_API_KEY is not set in environment variables');
      }

      const url = `${geminiApiUrl}?key=${geminiApiKey}`;

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 1024,
        },
      };

      const response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 seconds timeout
      });

      // Extract text from Gemini response
      const candidates = response.data?.candidates;
      if (!candidates || candidates.length === 0) {
        throw new Error('No response from Gemini API');
      }

      const content = candidates[0]?.content;
      if (!content || !content.parts || content.parts.length === 0) {
        throw new Error('Invalid response structure from Gemini API');
      }

      const text = content.parts[0]?.text;
      if (!text) {
        throw new Error('No text in Gemini API response');
      }

      return text;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.error?.message || error.message;
        throw new Error(
          `Gemini API error (${status || 'unknown'}): ${message}`,
        );
      }
      throw error;
    }
  }

  private parseEvaluationResponse(responseText: string): EvaluationResult {
    try {
      // Remove markdown code blocks if present
      let cleanedText = responseText.trim();

      // Remove ```json and ``` markers
      cleanedText = cleanedText.replace(/```json\s*/gi, '');
      cleanedText = cleanedText.replace(/```\s*/g, '');

      // Try to extract JSON from the response
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const jsonStr = jsonMatch[0];
      const parsed = JSON.parse(jsonStr);

      return {
        studentName: parsed.studentName || 'Unknown',
        rollNumber: parsed.rollNumber || 'Unknown',
        score: parseInt(parsed.score, 10) || 0,
        remarks: parsed.remarks || 'No remarks provided',
      };
    } catch (error) {
      console.error('Error parsing evaluation response:', error);
      console.error('Response text:', responseText);
      throw new Error(
        'Failed to parse AI evaluation response. Please check the API response format.',
      );
    }
  }
}
