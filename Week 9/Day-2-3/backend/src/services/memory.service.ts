import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Conversation,
  ConversationDocument,
} from '../models/conversation.schema';
import { Summary, SummaryDocument } from '../models/summary.schema';
import { GeminiAdapter } from '../ai/gemini-adapter';

@Injectable()
export class MemoryService {
  private readonly logger = new Logger(MemoryService.name);
  private readonly MAX_CONVERSATIONS = 20; // Max conversations before summarizing
  private readonly CONTEXT_MEMORY_SIZE = 10; // Number of recent conversations to include in context

  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @InjectModel(Summary.name) private summaryModel: Model<SummaryDocument>,
    private readonly geminiAdapter: GeminiAdapter,
  ) {}

  async retrieveMemory(userId: string): Promise<string> {
    try {
      // Get summary if exists
      const summary = await this.summaryModel.findOne({ userId });

      // Get recent conversations
      const recentConversations = await this.conversationModel
        .find({ userId })
        .sort({ timestamp: -1 })
        .limit(this.CONTEXT_MEMORY_SIZE)
        .exec();

      let memoryContext = '';

      // Extract key entities from recent conversations for better context tracking
      const entities = this.extractKeyEntities(recentConversations);

      // Specific handling for the most recent conversation to improve context continuity
      let mostRecentContext = '';
      if (recentConversations.length > 0) {
        const mostRecent = recentConversations[0];

        // Detect if the most recent conversation was about a specific format
        const formatMatch = mostRecent.question.match(
          /\b(test|odi|t20|t20i|twenty20)\b/i,
        );
        const format = formatMatch ? formatMatch[0].toLowerCase() : null;

        // Detect if it was about highest/lowest scores, most runs, etc.
        const statsMatch = mostRecent.question.match(
          /\b(highest|top|best|maximum|lowest|minimum|worst|most|average|economy)\s+(scores?|runs?|wickets?|batting|bowling|average|economy|innings|statistics)\b/i,
        );
        const statType = statsMatch ? statsMatch[0].toLowerCase() : null;

        if (format && statType) {
          mostRecentContext = `The user's most recent question was about ${statType} in ${format} cricket. If the next question is a brief follow-up or mentions a different format, it likely refers to the same stat type (${statType}).\n\n`;
        }
      }

      if (summary) {
        memoryContext += `Previous conversation summary: ${summary.summarizedMemory}\n\n`;
      }

      // Add the special context for most recent conversation
      if (mostRecentContext) {
        memoryContext += `IMPORTANT CONTEXT: ${mostRecentContext}`;
      }

      if (entities.length > 0) {
        memoryContext += `Context tracking: The conversation has involved ${entities.join(', ')}.\n\n`;
      }

      if (recentConversations.length > 0) {
        memoryContext += 'Recent conversations (most important for context):\n';
        // Limit to 3 most recent conversations for better focus
        const focusedConversations = recentConversations.slice(0, 3);
        focusedConversations.reverse().forEach((conv, index) => {
          memoryContext += `${index + 1}. Q: ${conv.question}\n`;
          memoryContext += `   A: ${this.extractAnswerText(conv.answer)}\n\n`;
        });

        // Add a note about other conversations if there are more
        if (recentConversations.length > 3) {
          memoryContext += `(${recentConversations.length - 3} more previous conversations available)\n\n`;
        }
      }

      return memoryContext || 'No previous conversation history.';
    } catch (error) {
      this.logger.error('Error retrieving memory:', error);
      return 'No previous conversation history.';
    }
  }

  async saveConversation(
    userId: string,
    question: string,
    answer: any,
  ): Promise<void> {
    try {
      // Save the new conversation
      await this.conversationModel.create({
        userId,
        question,
        answer,
      });

      // Check if we need to summarize
      const conversationCount = await this.conversationModel.countDocuments({
        userId,
      });

      if (conversationCount >= this.MAX_CONVERSATIONS) {
        await this.summarizeAndCleanup(userId);
      }
    } catch (error) {
      this.logger.error('Error saving conversation:', error);
    }
  }

  async getConversationHistory(userId: string, limit: number = 50) {
    try {
      return await this.conversationModel
        .find({ userId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .exec();
    } catch (error) {
      this.logger.error('Error getting conversation history:', error);
      return [];
    }
  }

  async getSummary(userId: string) {
    try {
      return await this.summaryModel.findOne({ userId });
    } catch (error) {
      this.logger.error('Error getting summary:', error);
      return null;
    }
  }

  async clearConversationHistory(userId: string): Promise<void> {
    try {
      await this.conversationModel.deleteMany({ userId });
      await this.summaryModel.deleteOne({ userId });
      this.logger.log(`Cleared conversation history for user ${userId}`);
    } catch (error) {
      this.logger.error('Error clearing conversation history:', error);
      throw error;
    }
  }

  private async summarizeAndCleanup(userId: string): Promise<void> {
    try {
      // Get all conversations for the user
      const conversations = await this.conversationModel
        .find({ userId })
        .sort({ timestamp: 1 })
        .exec();

      if (conversations.length === 0) return;

      // Create conversation text for summarization
      let conversationText = '';
      conversations.forEach((conv, index) => {
        conversationText += `Conversation ${index + 1}:\n`;
        conversationText += `User: ${conv.question}\n`;
        conversationText += `Assistant: ${this.extractAnswerText(conv.answer)}\n\n`;
      });

      // Generate summary using Gemini
      const summaryPrompt = `
Please summarize the following cricket-related conversation history into key facts and context that would be useful for future conversations. Focus on:
1. Cricket preferences mentioned by the user
2. Specific teams, players, or formats discussed
3. Any patterns in the questions asked
4. Important cricket statistics or facts that came up

Keep the summary concise but informative (max 300 words):

${conversationText}
      `;

      const summary = await this.geminiAdapter.generate(summaryPrompt);

      // Save or update the summary
      await this.summaryModel.findOneAndUpdate(
        { userId },
        {
          userId,
          summarizedMemory: summary,
          conversationCount: conversations.length,
          lastUpdated: new Date(),
        },
        { upsert: true },
      );

      // Keep only the most recent 5 conversations and delete the rest
      const recentConversations = conversations.slice(-5);
      const conversationsToDelete = conversations.slice(0, -5);

      if (conversationsToDelete.length > 0) {
        const idsToDelete = conversationsToDelete.map((conv) => conv._id);
        await this.conversationModel.deleteMany({ _id: { $in: idsToDelete } });
      }

      this.logger.log(
        `Summarized and cleaned up ${conversationsToDelete.length} conversations for user ${userId}`,
      );
    } catch (error) {
      this.logger.error('Error summarizing conversations:', error);
    }
  }

  private extractAnswerText(answer: any): string {
    if (typeof answer === 'string') return answer;

    if (answer?.type === 'text') return answer.data;

    if (answer?.type === 'table' && answer?.data?.rows) {
      return `Table with ${answer.data.rows.length} rows`;
    }

    if (answer?.type === 'multi-format' && Array.isArray(answer?.data)) {
      return `Multi-format response with ${answer.data.length} formats`;
    }

    return JSON.stringify(answer);
  }

  /**
   * Extract key entities from recent conversations to maintain context
   * This helps with follow-up questions by tracking what teams, players,
   * formats, and time periods have been discussed
   */
  private extractKeyEntities(conversations: ConversationDocument[]): string[] {
    if (!conversations || conversations.length === 0) {
      return [];
    }

    const entities = new Set<string>();

    // Regex patterns to detect cricket entities
    const patterns = {
      teams:
        /\b(india|pakistan|australia|england|south africa|new zealand|west indies|sri lanka|bangladesh|afghanistan|ireland|zimbabwe)\b/gi,
      formats:
        /\b(test|odi|t20|t20i|twenty20|one[- ]day|50[- ]over|5[- ]day)\b/gi,
      timeframes: /\b(20\d\d|19\d\d|last year|recent|all[- ]time)\b/gi,
      stats:
        /\b(runs|wickets|average|strike rate|centuries|fifties|highest|lowest|matches)\b/gi,
      venues: /\b(stadium|ground|oval|park|cricket ground)\b/gi,
      // New patterns to capture query intents
      queryIntents: {
        highestScores: /\b(highest|top|best|maximum) scores?\b/gi,
        lowestScores: /\b(lowest|minimum|worst) scores?\b/gi,
        mostRuns: /\bmost runs\b/gi,
        mostWickets: /\bmost wickets\b/gi,
        bestAverage: /\bbest average\b/gi,
        bestEconomy: /\bbest economy\b/gi,
      },
    };

    // Process each conversation
    conversations.forEach((conv, index) => {
      const text = `${conv.question} ${this.extractAnswerText(conv.answer)}`;

      // Extract teams
      const teamMatches = [...text.matchAll(patterns.teams)];
      teamMatches.forEach((match) => {
        entities.add(`team ${match[0].toLowerCase()}`);
      });

      // Extract formats
      const formatMatches = [...text.matchAll(patterns.formats)];
      formatMatches.forEach((match) => {
        let format = match[0].toLowerCase();
        if (format === 'test') format = 'Test cricket';
        if (format === 'odi' || format.includes('day') || format.includes('50'))
          format = 'ODI cricket';
        if (format.includes('t20') || format.includes('twenty'))
          format = 'T20 cricket';
        entities.add(format);
      });

      // Extract time frames
      const timeMatches = [...text.matchAll(patterns.timeframes)];
      timeMatches.forEach((match) => {
        entities.add(`time period ${match[0].toLowerCase()}`);
      });

      // Extract query intents (most recent conversations have priority)
      if (index < 3) {
        // Check for query intents in more recent conversations
        Object.entries(patterns.queryIntents).forEach(([intentType, regex]) => {
          if (regex.test(text)) {
            // Reset regex lastIndex after test
            regex.lastIndex = 0;

            // Add query intent as an entity
            entities.add(
              `query about ${intentType.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
            );
          }
        });
      }
    });

    // Return unique entities as an array
    return Array.from(entities);
  }
}
