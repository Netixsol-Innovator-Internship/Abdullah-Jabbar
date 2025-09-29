/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * GeminiAdapter - calls Google's Generative Language REST API when an API key
 * is present in process.env.GEMINI_API_KEY. If the key is not present, it
 * keeps the previous stubbed behavior to allow local development without the
 * external dependency.
 *
 * Notes:
 * - This implementation uses the REST endpoint under
 *   https://generativelanguage.googleapis.com/v1beta2/models/{model}:generateText
 *   and passes the API key as a query param (?key=API_KEY).
 * - model may be provided in options.model as either a short name (e.g.
 *   'text-bison-001' or 'gemini-1.5') or the full resource id
 *   ('models/text-bison-001'). When not provided, it looks at
 *   process.env.GEMINI_MODEL or falls back to 'models/text-bison-001'.
 */

@Injectable()
export class GeminiAdapter {
  private readonly logger = new Logger(GeminiAdapter.name);

  constructor() {}

  // options may include model (string), maxTokens (number), temperature (number)
  async generate(
    prompt: string,
    options: { model?: string; maxTokens?: number; temperature?: number } = {},
  ): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY || '';

    // If no API key is configured, fall back to the original local stubs.
    if (!apiKey) {
      this.logger.debug(
        'GEMINI_API_KEY not set — using local stubbed responses',
      );
      return this.stubbedResponse(prompt);
    }

    // prefer a model name like 'gemini-1.5-pro' or 'gemini-1.5-flash'; let callers override
    const modelName =
      options.model || process.env.GEMINI_MODEL || 'gemini-1.5-flash';

    try {
      this.logger.debug('Using Google Generative AI with model:', modelName);

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: modelName });

      const generationConfig = {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxTokens || 1000,
      };

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
      });

      const response = await result.response;
      const text = response.text();

      this.logger.debug('Generated response length:', text.length);
      return text;
    } catch (error: any) {
      this.logger.error('Google Generative AI error:', error.message);

      // Fall back to stubbed responses on error
      this.logger.warn('Falling back to stubbed responses due to API error');
      return this.stubbedResponse(prompt);
    }
  }

  // Keep the earlier example stubs for local development / testing without an API key
  private stubbedResponse(prompt: string): string {
    if (prompt.includes('Show Australia ODI matches in 2005')) {
      return `{
  "collection":"matches",
  "filter":{ "format":"odi", "team":"Australia", "start_date":{"$gte":"2005-01-01T00:00:00.000Z","$lte":"2005-12-31T23:59:59.999Z"} },
  "projection":{},
  "sort":{"start_date":1},
  "limit":100
}`;
    }

    if (prompt.includes('Top 5 T20 matches with highest team scores')) {
      return `{
  "collection":"matches",
  "filter":{ "format":"t20" },
  "projection":{ "team":1, "runs":1, "start_date":1, "ground":1 },
  "sort":{ "runs": -1 },
  "limit": 5
}`;
    }

    if (
      prompt.includes("England’s score vs Australia at Lord's on 26 Aug 1972")
    ) {
      return `{
  "collection":"matches",
  "filter":{ "format":"test", "team":"England", "opposition":"Australia", "ground":"Lord's", "start_date":{ "$gte":"1972-08-26T00:00:00.000Z", "$lte":"1972-08-26T23:59:59.999Z" } },
  "projection":{},
  "sort":{},
  "limit": 10
}`;
    }

    // Example of generic question handling - returns array for all formats
    if (
      (prompt.includes('highest score') ||
        prompt.includes('highest scores') ||
        prompt.includes('best score') ||
        prompt.includes('best scores') ||
        prompt.includes('maximum score') ||
        prompt.includes('top score')) &&
      !prompt.match(/\b(test|odi|t20)\b/i)
    ) {
      return `[
  {
    "collection":"matches",
    "filter":{ "format":"test" },
    "projection":{ "team":1, "runs":1, "opposition":1, "start_date":1, "ground":1 },
    "sort":{ "runs": -1 },
    "limit": 5
  },
  {
    "collection":"matches", 
    "filter":{ "format":"odi" },
    "projection":{ "team":1, "runs":1, "opposition":1, "start_date":1, "ground":1 },
    "sort":{ "runs": -1 },
    "limit": 5
  },
  {
    "collection":"matches",
    "filter":{ "format":"t20" },
    "projection":{ "team":1, "runs":1, "opposition":1, "start_date":1, "ground":1 },
    "sort":{ "runs": -1 },
    "limit": 5
  }
]`;
    }

    // Handle format switching follow-ups
    if (
      prompt.toLowerCase().includes('what about test') ||
      prompt.toLowerCase().includes('and test') ||
      prompt.toLowerCase().match(/^test\s*\??$/i)
    ) {
      return `{
  "collection":"matches",
  "filter":{ "format":"test" },
  "projection":{ "team":1, "runs":1, "opposition":1, "start_date":1, "ground":1 },
  "sort":{ "runs": -1 },
  "limit": 5
}`;
    }

    if (
      prompt.toLowerCase().includes('what about odi') ||
      prompt.toLowerCase().includes('and odi') ||
      prompt.toLowerCase().match(/^odi\s*\??$/i)
    ) {
      return `{
  "collection":"matches",
  "filter":{ "format":"odi" },
  "projection":{ "team":1, "runs":1, "opposition":1, "start_date":1, "ground":1 },
  "sort":{ "runs": -1 },
  "limit": 5
}`;
    }

    if (
      prompt.toLowerCase().includes('what about t20') ||
      prompt.toLowerCase().includes('and t20') ||
      prompt.toLowerCase().match(/^t20\s*\??$/i)
    ) {
      return `{
  "collection":"matches",
  "filter":{ "format":"t20" },
  "projection":{ "team":1, "runs":1, "opposition":1, "start_date":1, "ground":1 },
  "sort":{ "runs": -1 },
  "limit": 5
}`;
    }

    return '{}';
  }
}
