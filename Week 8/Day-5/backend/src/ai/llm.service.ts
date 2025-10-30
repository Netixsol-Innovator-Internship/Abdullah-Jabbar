// File: src/ai/llm.service.ts
import { Injectable, Logger } from '@nestjs/common';
// OpenAI/Anthropic providers commented out — this service is configured to use Gemini only.
// import { ChatOpenAI } from '@langchain/openai';
// import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';

@Injectable()
export class LLMService {
  private readonly logger = new Logger(LLMService.name);
  // use a loose type to avoid strict lib type mismatches
  private llm: any;

  constructor() {
    this.initializeLLM();
  }

  private initializeLLM(): void {
    // Force default to Gemini; allow override via LLM_PROVIDER if you want to test others.
    const provider = process.env.LLM_PROVIDER || 'gemini';

    switch (provider) {
      case 'gemini': {
        // LangChain wrapper for Google Generative AI (Gemini)
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
          throw new Error(
            'Missing GEMINI_API_KEY / GOOGLE_API_KEY for Gemini provider',
          );
        }

        this.llm = new ChatGoogleGenerativeAI({
          apiKey,
          model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
          temperature: Number(process.env.LLM_TEMPERATURE) || 0.2,
        } as any);
        break;
      }

      /*
      // OpenAI and Anthropic support is intentionally commented out because you
      // indicated you only have a Gemini key. Uncomment and install the
      // corresponding packages if you later want to enable them.

      case 'openai':
        this.llm = new ChatOpenAI({
          openAIApiKey: process.env.OPENAI_API_KEY,
          modelName: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
          temperature: 0.2,
        } as any);
        break;

      case 'anthropic':
        this.llm = new ChatAnthropic({
          anthropicApiKey: process.env.ANTHROPIC_API_KEY,
          modelName: process.env.ANTHROPIC_MODEL || 'claude-3-opus-20240229',
          temperature: 0.2,
        } as any);
        break;
      */

      default:
        throw new Error(`Unsupported LLM provider: ${provider}`);
    }

    this.logger.log(`LLM initialized with provider: ${provider}`);
  }

  async invoke(prompt: string): Promise<string> {
    try {
      const response = await this.llm.invoke(prompt);

      // Normalize common response shapes from different providers
      // - LangChain Chat models often return an object with `content` or `message.content`
      // - Google ChatGoogleGenerativeAI returns objects where text may live in candidate.content or message.content
      if (!response) return '';

      // direct string
      if (typeof response === 'string') return response;

      // response.content (common wrapper)
      if (response.content && typeof response.content === 'string')
        return response.content;

      // response.message.content is often an array of blocks
      if (response.message && Array.isArray(response.message.content)) {
        return response.message.content.map((c: any) => c?.text ?? '').join('');
      }

      // candidates -> content array (Google Gen AI style)
      if (
        Array.isArray(response.candidates) &&
        response.candidates.length > 0
      ) {
        const candidate = response.candidates[0];
        if (Array.isArray(candidate.content)) {
          return candidate.content.map((c: any) => c?.text ?? '').join('');
        }
        if (typeof candidate.output === 'string') return candidate.output;
      }

      // fallback: try to JSON-stringify small content fields
      if (response?.text) return response.text;

      return JSON.stringify(response);
    } catch (error) {
      this.logger.error(`LLM invocation failed: ${error.message}`);
      throw error;
    }
  }

  // compatibility wrapper used by other services
  async generateText(prompt: string): Promise<string> {
    return this.invoke(prompt);
  }
}
