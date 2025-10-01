/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument */
import { Injectable, Logger } from '@nestjs/common';
import { RelevancyService } from '../../services/relevancy.service';
import { QueryGeneratorService } from '../../services/query-generator.service';
import { QueryValidatorService } from '../../services/query-validator.service';
import { MongoQueryService } from '../../services/mongo-query.service';
import { FormatterService } from '../../services/formatter.service';
import { MemoryService } from '../../services/memory.service';
import { GeminiAdapter } from '../../ai/gemini-adapter';

@Injectable()
export class AskService {
  private readonly logger = new Logger(AskService.name);

  constructor(
    private readonly relevancy: RelevancyService,
    private readonly generator: QueryGeneratorService,
    private readonly validator: QueryValidatorService,
    private readonly executor: MongoQueryService,
    private readonly formatter: FormatterService,
    private readonly memory: MemoryService,
    private readonly gemini: GeminiAdapter,
  ) {}

  async handleQuestion(question: string, userId: string = 'default') {
    // Pre-process question to detect follow-ups
    const isFollowUp = this.isLikelyFollowUp(question);
    this.logger.log(
      `Question "${question}" detected as follow-up: ${isFollowUp}`,
    );

    // Apply more comprehensive normalization
    const normalized = this.normalizeQuestion(question);

    // Node 1: Enhanced Relevancy Check (with our improved service)
    const rel = await this.relevancy.isRelevant(normalized, userId);
    if (!rel.is_relevant) {
      return {
        type: 'text',
        data: 'Sorry, I can only answer cricket-related questions.',
        meta: { reason: rel.reason },
      };
    }

    // Get recent conversation history to extract context
    const recentHistory = await this.memory.getConversationHistory(userId, 3);
    const lastQuestion =
      recentHistory.length > 0 ? recentHistory[0].question : '';
    const lastAnswer =
      recentHistory.length > 0 ? recentHistory[0].answer : null;

    // Node 2: Memory Retriever for context awareness
    const memoryContext = await this.memory.retrieveMemory(userId);

    // Enhanced context handling for follow-up questions
    let enhancedQuestion = normalized;

    // Extract format information outside the if block for later use
    const lastFormat = lastQuestion
      ? this.extractFormatFromQuestion(lastQuestion)
      : null;
    const currentFormat = this.extractFormatFromQuestion(question);

    if (isFollowUp && lastQuestion && lastAnswer) {
      // If this is a format switch (e.g., "what about test" after "highest score in t20")
      if (currentFormat && lastFormat && currentFormat !== lastFormat) {
        // Extract the query intent from previous question (e.g., "highest score")
        const queryIntent = this.extractQueryIntent(lastQuestion);

        if (queryIntent) {
          enhancedQuestion = `${queryIntent} in ${currentFormat} cricket`;
          this.logger.log(`Enhanced follow-up question: "${enhancedQuestion}"`);
        }
      }
      // If it's just a brief follow-up without specific format or detail
      else if (question.split(' ').length <= 3) {
        enhancedQuestion = `${lastQuestion} but for ${question}`;
        this.logger.log(
          `Expanded brief follow-up question: "${enhancedQuestion}"`,
        );
      }
    }

    // Node 3: Query generation with enhanced context
    let generated;

    // Special handling for format switching follow-ups
    if (isFollowUp && currentFormat) {
      const formatMap = { test: 'test', odi: 'odi', t20: 't20' };
      const queryFormat = formatMap[currentFormat.toLowerCase()];

      if (queryFormat && lastQuestion.toLowerCase().includes('highest score')) {
        // Directly generate query for highest score in the requested format
        this.logger.log(
          `Format switch detected: Directly generating highest score query for ${queryFormat}`,
        );
        generated = {
          collection: 'matches',
          filter: { format: queryFormat },
          projection: {
            team: 1,
            runs: 1,
            opposition: 1,
            start_date: 1,
            ground: 1,
          },
          sort: { runs: -1 },
          limit: 5,
        };
      } else {
        // Use standard generation with enhanced context
        generated = await this.generator.generateQuery(
          enhancedQuestion,
          memoryContext,
        );
      }
    } else {
      // Standard query generation
      generated = await this.generator.generateQuery(
        enhancedQuestion,
        memoryContext,
      );
    }

    // Handle case where query generator can't create a MongoDB query
    if (generated?.error === 'cannot_generate_query') {
      this.logger.log(`Query generator cannot create query for: ${normalized}`);

      // For general cricket questions, use Gemini to provide a direct answer
      const generalAnswer = await this.gemini.generate(
        `Answer this cricket-related question: ${normalized}
        
        Provide a helpful, informative answer about cricket. Keep it concise but informative.`,
      );

      // Save to memory
      await this.memory.saveConversation(userId, normalized, {
        type: 'text',
        data: generalAnswer,
      });

      return {
        type: 'text',
        data: generalAnswer,
        meta: {
          source: 'general_knowledge',
          reason: 'No database query needed',
        },
      };
    }

    // Normalize generated queries to avoid invalid or nonsensical filters
    const normalizeGenerated = (q: any) => {
      try {
        if (q && q.filter && q.filter.team && q.filter.opposition) {
          const team = q.filter.team;
          const opp = q.filter.opposition;
          if (
            typeof team === 'string' &&
            typeof opp === 'string' &&
            team === opp
          ) {
            // Replace exact-equality team/opposition with an $or for safety:
            // either team == X OR opposition == X
            const copy = { ...q.filter };
            // remove specific team/opposition fields
            delete copy.team;
            delete copy.opposition;
            q.filter = {
              ...copy,
              $or: [{ team }, { opposition: team }],
            };
            this.logger.warn(
              `Normalized query filter where team and opposition were identical (${team}) -> converted to $or`,
            );
          }
        }
      } catch (e) {
        this.logger.error('Error normalizing generated query', e);
      }
      return q;
    };

    // Handle both single queries and arrays of queries
    if (Array.isArray(generated)) {
      // Multiple queries for cross-format comparison
      const results: any[] = [];
      for (const query of generated) {
        try {
          normalizeGenerated(query);
          // Node 3: Validate + sanitize
          const sanitized = this.validator.validateAndSanitize(query);
          this.applyResultIntent(sanitized, question, enhancedQuestion);
          this.applySingleResultPreference(
            sanitized,
            question,
            enhancedQuestion,
          );

          // Node 4: Execute
          const rows = await this.executor.execute(sanitized);

          // Node 5: Format
          const output = this.formatter.format(rows, sanitized);

          results.push({
            format: this.getFormatFromQuery(sanitized),
            ...output,
            meta: { query: sanitized },
          });
        } catch (error) {
          // Continue with other formats if one fails
          console.warn(
            `Failed to execute query for collection ${query.collection}:`,
            error,
          );
        }
      }

      const result = {
        type: 'multi-format',
        data: results,
        meta: { totalFormats: results.length },
      };

      // Node 6: Memory Saver
      await this.memory.saveConversation(userId, question, result);

      return result;
    } else {
      // Single query
      normalizeGenerated(generated);
      // Node 4: Validate + sanitize
      const sanitized = this.validator.validateAndSanitize(generated);
      this.applyResultIntent(sanitized, question, enhancedQuestion);
      this.applySingleResultPreference(sanitized, question, enhancedQuestion);

      // Node 5: Execute
      const rows = await this.executor.execute(sanitized);

      // Node 6: Format
      const output = this.formatter.format(rows, sanitized);

      // meta: include sanitized query but strip anything sensitive
      const meta = { query: sanitized };
      const result = {
        ...output,
        meta,
        format: this.getFormatFromQuery(sanitized),
      };

      // Node 7: Memory Saver
      await this.memory.saveConversation(userId, question, result);

      return result;
    }
  }

  private getFormatFromQuery(query: any): string {
    // Check if there's a format filter in the query
    if (query.filter && query.filter.format) {
      const format = query.filter.format.toLowerCase();
      if (format === 'test') return 'Test';
      if (format === 'odi') return 'ODI';
      if (format === 't20') return 'T20';
    }

    // Fallback: check collection name (for backward compatibility)
    if (query.collection) {
      const collection = query.collection.toLowerCase();
      if (collection.includes('test')) return 'Test';
      if (collection.includes('odi')) return 'ODI';
      if (collection.includes('t20')) return 'T20';
    }

    return 'Unknown';
  }

  private applyResultIntent(
    sanitizedQuery: any,
    originalQuestion: string,
    enhancedQuestion: string,
  ) {
    const context = `${originalQuestion ?? ''} ${
      enhancedQuestion ?? ''
    }`.toLowerCase();
    const wantsTie = /\b(tie|tied|ties)\b/.test(context);
    const wantsDraw = /\b(draw|drawn|draws)\b/.test(context);

    if (!wantsTie && !wantsDraw) {
      return;
    }

    const patterns: string[] = [];
    if (wantsTie) patterns.push('tie');
    if (wantsDraw) patterns.push('draw');

    const regexPattern =
      patterns.length === 1 ? patterns[0] : `(${patterns.join('|')})`;
    const resultMatcher = { $regex: regexPattern, $options: 'i' };

    if (
      sanitizedQuery?.isAggregation &&
      Array.isArray(sanitizedQuery.pipeline)
    ) {
      const matchStage = sanitizedQuery.pipeline.find(
        (stage: any) => stage.$match && typeof stage.$match === 'object',
      );
      if (matchStage) {
        matchStage.$match.result = resultMatcher;
      }
      return;
    }

    if (!sanitizedQuery.filter || typeof sanitizedQuery.filter !== 'object') {
      sanitizedQuery.filter = {};
    }

    sanitizedQuery.filter.result = resultMatcher;
  }

  private applySingleResultPreference(
    sanitizedQuery: any,
    originalQuestion: string,
    enhancedQuestion: string,
  ) {
    const context = this.buildContext(originalQuestion, enhancedQuestion);
    const wantsScoreDetails =
      this.shouldIncludeScoreDetailsFromContext(context);

    if (wantsScoreDetails) {
      sanitizedQuery.__forceScoreProjection = true;
    }

    if (!this.shouldForceSingleResultFromContext(context)) {
      return;
    }

    if (
      sanitizedQuery?.isAggregation &&
      Array.isArray(sanitizedQuery.pipeline)
    ) {
      this.applySingleResultToAggregation(
        sanitizedQuery.pipeline,
        wantsScoreDetails,
      );
      return;
    }

    const needsLimit =
      typeof sanitizedQuery.limit !== 'number' || sanitizedQuery.limit > 1;
    if (needsLimit) {
      sanitizedQuery.limit = 1;
    }
  }

  private applySingleResultToAggregation(
    pipeline: Array<Record<string, any>>,
    wantsScoreDetails: boolean,
  ) {
    if (!Array.isArray(pipeline)) {
      return;
    }

    const existingLimitStage = pipeline.find(
      (stage) => stage.$limit !== undefined,
    );
    if (existingLimitStage) {
      existingLimitStage.$limit = 1;
      return;
    }

    const sortIndex = pipeline.findIndex((stage) => stage.$sort !== undefined);
    const limitStage = { $limit: 1 };

    if (sortIndex >= 0 && sortIndex < pipeline.length - 1) {
      pipeline.splice(sortIndex + 1, 0, limitStage);
    } else {
      pipeline.push(limitStage);
    }

    if (wantsScoreDetails) {
      const projectionStage = pipeline.find((stage) => stage.$project);
      const scoreProjection = this.getScoreboardProjection();

      if (projectionStage && projectionStage.$project) {
        Object.assign(projectionStage.$project, scoreProjection);
      } else {
        pipeline.push({ $project: scoreProjection });
      }
    }
  }

  private buildContext(
    originalQuestion: string,
    enhancedQuestion: string,
  ): string {
    const raw = `${originalQuestion ?? ''} ${enhancedQuestion ?? ''}`.trim();
    return raw.replace(/\s+/g, ' ').toLowerCase();
  }

  private shouldForceSingleResultFromContext(context: string): boolean {
    if (!context) {
      return false;
    }

    // Respect explicit plural intents or numeric ranges
    if (/(top|first|last)\s+\d+/.test(context)) return false;
    if (
      /\btop\b|\blist\b|\bshow\b|\bgive\b|\bprovide\b|\bmultiple\b/.test(
        context,
      )
    )
      return false;
    if (/\b\d+\b/.test(context)) return false;

    const singularKeywords = [
      'lowest',
      'highest',
      'best',
      'worst',
      'record',
      'maximum',
      'minimum',
      'most runs',
      'least runs',
      'biggest',
      'smallest',
      'first ever',
      'only',
    ];

    if (singularKeywords.some((keyword) => context.includes(keyword))) {
      return true;
    }

    if (
      /\bwhat\s+(is|was)\b/.test(context) &&
      /\bscore|total|result|record|match\b/.test(context)
    ) {
      return true;
    }

    return false;
  }

  private shouldIncludeScoreDetailsFromContext(context: string): boolean {
    if (!context) {
      return false;
    }

    const keywords = [
      'score',
      'scores',
      'total',
      'runs',
      'run rate',
      'all out',
      'innings',
      'target',
      'lowest',
      'highest',
      'best',
      'worst',
      'record',
      'won by',
      'lost by',
      'lead',
      'most runs',
      'least runs',
      'chased',
      'defended',
    ];

    return keywords.some((keyword) => context.includes(keyword));
  }

  private getScoreboardProjection(): Record<string, number> {
    return {
      _id: 0,
      team: 1,
      opposition: 1,
      runs: 1,
      wickets: 1,
      overs: 1,
      balls: 1,
      rpo: 1,
      ground: 1,
      start_date: 1,
      result: 1,
      inns: 1,
      lead: 1,
    };
  }

  /**
   * Normalizes user input to handle common variations and typos
   */
  private normalizeQuestion(question: string): string {
    let normalized = question.trim();

    // Replace common cricket abbreviations with full terms for better matching
    const replacements: Record<string, string> = {
      ipl: 'Indian Premier League',
      bbl: 'Big Bash League',
      psl: 'Pakistan Super League',
      cpl: 'Caribbean Premier League',
      wc: 'World Cup',
      sr: 'strike rate',
      econ: 'economy rate',
      avg: 'average',
      wkt: 'wicket',
      wkts: 'wickets',
      aus: 'Australia',
      eng: 'England',
      ind: 'India',
      pak: 'Pakistan',
      sa: 'South Africa',
      nz: 'New Zealand',
      sl: 'Sri Lanka',
      wi: 'West Indies',
      ban: 'Bangladesh',
      zim: 'Zimbabwe',
      afg: 'Afghanistan',
      ire: 'Ireland',
    };

    // Only replace when they appear as standalone words (with word boundaries)
    for (const [abbr, full] of Object.entries(replacements)) {
      const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
      normalized = normalized.replace(regex, full);
    }

    return normalized;
  }

  /**
   * Determines if a question is likely a follow-up based on its characteristics
   */
  private isLikelyFollowUp(question: string): boolean {
    const normalizedQuestion = question.toLowerCase().trim();

    // Very short questions are likely follow-ups
    if (normalizedQuestion.split(' ').length <= 3) {
      return true;
    }

    // Questions starting with pronouns or reference words
    if (
      /^(and|also|what about|how about|what if|so|then|they|their|those|these|that|this|it|its|his|her|he|she)\b/i.test(
        normalizedQuestion,
      )
    ) {
      return true;
    }

    // Questions containing comparative terms without context
    if (
      /\b(more|less|better|worse|higher|lower|compared|versus|vs)\b/i.test(
        normalizedQuestion,
      ) &&
      !/(compared to|versus|vs\.?)\s+[a-z\s]{5,}/i.test(normalizedQuestion)
    ) {
      return true;
    }

    // Questions that are just team names with optional punctuation
    if (
      /^(australia|england|india|pakistan|south africa|new zealand|sri lanka|bangladesh|afghanistan|ireland|west indies|zimbabwe)[.?!]*$/i.test(
        normalizedQuestion,
      )
    ) {
      return true;
    }

    // Format switch patterns (e.g., "what about test" after a question about T20)
    if (
      /^(what|how) about (test|odi|t20|t20i|twenty20|one[- ]?day)/i.test(
        normalizedQuestion,
      )
    ) {
      return true;
    }

    // Single cricket formats with optional punctuation
    if (/^(test|odi|t20|t20i)[.?!]*$/i.test(normalizedQuestion)) {
      return true;
    }

    // Single cricket terms followed by optional punctuation
    if (
      /^(batting|bowling|fielding|scores?|runs?|wickets?|overs?|innings|results?|stats|average|economy|strike rate)[.?!]*$/i.test(
        normalizedQuestion,
      )
    ) {
      return true;
    }

    return false;
  }

  /**
   * Extracts cricket format (test, odi, t20) from a question
   */
  private extractFormatFromQuestion(question: string): string | null {
    const normalizedQuestion = question.toLowerCase().trim();

    if (normalizedQuestion.includes('test')) return 'test';
    if (
      normalizedQuestion.includes('odi') ||
      normalizedQuestion.includes('one day') ||
      normalizedQuestion.includes('oneday') ||
      normalizedQuestion.includes('50 over')
    )
      return 'odi';
    if (
      normalizedQuestion.includes('t20') ||
      normalizedQuestion.includes('twenty20') ||
      normalizedQuestion.includes('t-20') ||
      normalizedQuestion.includes('twenty-20') ||
      normalizedQuestion.includes('20 over')
    )
      return 't20';

    return null;
  }

  /**
   * Extracts the query intent from a question (e.g., "highest score", "most wickets")
   */
  private extractQueryIntent(question: string): string | null {
    const normalizedQuestion = question.toLowerCase().trim();

    if (
      normalizedQuestion.includes('highest score') ||
      normalizedQuestion.includes('best score') ||
      normalizedQuestion.includes('top score')
    ) {
      return 'highest score';
    }

    if (
      normalizedQuestion.includes('lowest score') ||
      normalizedQuestion.includes('worst score') ||
      normalizedQuestion.includes('minimum score')
    ) {
      return 'lowest score';
    }

    if (
      normalizedQuestion.includes('most runs') ||
      normalizedQuestion.includes('highest runs')
    ) {
      return 'most runs';
    }

    if (
      normalizedQuestion.includes('most wickets') ||
      normalizedQuestion.includes('highest wickets')
    ) {
      return 'most wickets';
    }

    if (normalizedQuestion.includes('best average')) {
      return 'best batting average';
    }

    if (normalizedQuestion.includes('best economy')) {
      return 'best bowling economy';
    }

    return null;
  }

  /**
   * Enriches a follow-up question with context from previous conversation
   * This helps make short queries more specific based on conversation history
   */
  private async enrichFollowUpQuestion(
    question: string,
    memoryContext: string,
  ): Promise<string> {
    // If not enough context or question is already detailed, return as is
    if (
      !memoryContext ||
      memoryContext.includes('No previous conversation history') ||
      question.length > 50
    ) {
      return question;
    }

    const normalizedQuestion = question.toLowerCase().trim();

    // Extract the most recent question from memory context
    const recentQuestionMatch = memoryContext.match(/\d+\.\s+Q:\s+([^\n]+)/);
    const recentQuestion = recentQuestionMatch ? recentQuestionMatch[1] : '';

    // For very short questions, use query generator's existing prompt template mechanism
    if (
      normalizedQuestion.split(' ').length <= 3 ||
      /^(and|also|what about|how about)\b/.test(normalizedQuestion)
    ) {
      try {
        // Try to generate a complete question based on the context
        const simplePrompt = `Complete this cricket question: "${question}"`;
        const result = await this.generator.generateQuery(
          simplePrompt,
          memoryContext,
        );

        // If we got a string result that's actually helpful
        if (
          typeof result === 'string' &&
          !result.startsWith('{') &&
          result.length > question.length + 10
        ) {
          return result.trim();
        }
      } catch (error) {
        this.logger.error('Error enriching follow-up question:', error);
      }
    }

    // For comparative terms without context, try to add previous context
    if (
      /\b(more|less|better|worse|higher|lower|top|bottom)\b/i.test(
        normalizedQuestion,
      ) &&
      !/(compared to|versus|vs\.?)\s+[a-z\s]{5,}/i.test(normalizedQuestion)
    ) {
      // Simple concatenation fallback when enrichment fails
      if (recentQuestion) {
        return `${normalizedQuestion}, in context of ${recentQuestion}`;
      }
    }

    // If all enrichment attempts fail, return the original question
    return question;
  }

  /**
   * Preprocess and normalize user questions to handle variations, abbreviations, etc.
   * This improves the ability to understand different ways users phrase the same concept
   */
  private preprocessQuestion(question: string): string {
    const normalizedQuestion = question.trim();

    // 1. Expand team abbreviations
    const teamAbbreviations = {
      aus: 'Australia',
      eng: 'England',
      ind: 'India',
      pak: 'Pakistan',
      nz: 'New Zealand',
      sa: 'South Africa',
      wi: 'West Indies',
      ban: 'Bangladesh',
      zim: 'Zimbabwe',
      afg: 'Afghanistan',
      sl: 'Sri Lanka',
      ire: 'Ireland',
      sco: 'Scotland',
      neth: 'Netherlands',
      uae: 'United Arab Emirates',
    };

    // 2. Expand format abbreviations
    const formatAbbreviations = {
      t20: 'T20',
      t20i: 'T20I',
      odis: 'One Day Internationals',
      odi: 'ODI',
      tests: 'Test matches',
    };

    // 3. Expand cricket term abbreviations
    const cricketTerms = {
      sr: 'strike rate',
      avg: 'average',
      wkts: 'wickets',
      rr: 'run rate',
      motm: 'man of the match',
      wc: 'World Cup',
      ipl: 'Indian Premier League',
      bbl: 'Big Bash League',
      psl: 'Pakistan Super League',
      icc: 'International Cricket Council',
    };

    // Apply all abbreviation expansions
    let processed = normalizedQuestion;

    // Replace team abbreviations - check for word boundaries
    Object.entries(teamAbbreviations).forEach(([abbr, full]) => {
      const pattern = new RegExp(`\\b${abbr}\\b`, 'gi');
      processed = processed.replace(pattern, full);
    });

    // Replace format abbreviations
    Object.entries(formatAbbreviations).forEach(([abbr, full]) => {
      const pattern = new RegExp(`\\b${abbr}\\b`, 'gi');
      processed = processed.replace(pattern, full);
    });

    // Replace cricket term abbreviations
    Object.entries(cricketTerms).forEach(([abbr, full]) => {
      const pattern = new RegExp(`\\b${abbr}\\b`, 'gi');
      processed = processed.replace(pattern, full);
    });

    return processed;
  }
}
