import { Injectable, Logger } from '@nestjs/common';
import { GeminiAdapter } from '../ai/gemini-adapter';
import { MemoryService } from './memory.service';

@Injectable()
export class RelevancyService {
  private readonly logger = new Logger(RelevancyService.name);

  constructor(
    private readonly gemini: GeminiAdapter,
    private readonly memory: MemoryService,
  ) {}

  // Comprehensive NLP processing for cricket queries
  async isRelevant(
    question: string,
    userId: string = 'default',
  ): Promise<{ is_relevant: boolean; reason?: string }> {
    const normalizedQuestion = question.toLowerCase().trim();

    // 1. Comprehensive cricket keyword matching
    const cricketTerms = [
      // Basic cricket terms
      'cricket',
      'odi',
      'test',
      't20',
      't20i',
      'ipl',
      'bbl',
      'psl',
      'cpl',
      'over',
      'innings',
      'score',
      'scores',
      'scoring',
      'scored',
      'stat',
      'stats',
      'statistics',
      'ball',
      'balls',
      'wicket',
      'wickets',
      'run',
      'runs',
      'rpo',
      'match',
      'matches',
      'series',
      'tournament',
      'trophy',
      'championship',
      'world cup',

      // Cricket-specific actions and terms
      'batsman',
      'batter',
      'batting',
      'bowler',
      'bowling',
      'fielder',
      'fielding',
      'century',
      'centuries',
      'ton',
      'double century',
      'triple century',
      'fifty',
      'duck',
      'golden duck',
      'hat-trick',
      'hattrick',
      'yorker',
      'bouncer',
      'googly',
      'maiden',
      'over',
      'boundaries',
      'boundary',
      'four',
      'sixer',
      'six',
      'extras',
      'lbw',
      'stumped',
      'caught',
      'bowled',
      'run out',
      'runout',
      'dismissed',
      'partnership',
      'economy',
      'average',
      'strike rate',
      'sr',
      'target',
      'chase',
      'powerplay',
      'death overs',
      'drs',
      'umpire',
      'no ball',
      'wide',
      'bye',
      'leg bye',
      'all out',
      'declaration',
      'declared',
      'draw',
      'tie',
      'super over',

      // Formats and competitions
      'wt20',
      'world t20',
      'icc',
      'champions trophy',
      'one-day',
      'one day',
      'test match',
      'test cricket',
      'five-day',
      'limited overs',
      'twenty20',
      'bilateral',
      'tri-series',
      'triangular',
      'quadrangular',

      // Teams and common abbreviations
      'australia',
      'aus',
      'aussies',
      'england',
      'eng',
      'india',
      'ind',
      'pakistan',
      'pak',
      'south africa',
      'sa',
      'proteas',
      'new zealand',
      'nz',
      'black caps',
      'sri lanka',
      'sl',
      'lanka',
      'bangladesh',
      'ban',
      'tigers',
      'afghanistan',
      'afg',
      'ireland',
      'ire',
      'west indies',
      'wi',
      'windies',
      'zimbabwe',
      'zim',
      'namibia',
      'nepal',
      'scotland',
      'netherlands',
      'dutch',
      'uae',
      'oman',
      'kenya',
      'canada',
      'usa',
      'hong kong',
    ];

    // Famous cricket stadiums/grounds
    const venues = [
      'lords',
      "lord's",
      'oval',
      'melbourne',
      'mcg',
      'sydney',
      'scg',
      'adelaide',
      'adelaide oval',
      'perth',
      'waca',
      'brisbane',
      'gabba',
      'cape town',
      'newlands',
      'johannesburg',
      'wanderers',
      'durban',
      'kingsmead',
      'centurion',
      'mumbai',
      'wankhede',
      'delhi',
      'kotla',
      'feroz shah kotla',
      'arun jaitley',
      'chennai',
      'chepauk',
      'kolkata',
      'eden gardens',
      'bangalore',
      'bengaluru',
      'chinnaswamy',
      'hyderabad',
      'uppal',
      'mohali',
      'kanpur',
      'green park',
      'nagpur',
      'vca',
      'ahmedabad',
      'narendra modi',
      'motera',
      'rajkot',
      'dharamshala',
      'dharamsala',
      'guwahati',
      'cuttack',
      'barabati',
      'ranchi',
      'indore',
      'holkar',
      'pune',
      'trent bridge',
      'edgbaston',
      'headingley',
      'old trafford',
      'rose bowl',
      'southampton',
      'sabina park',
      'kensington oval',
      'bridgetown',
      'queens park oval',
      'port of spain',
      'guyana',
      'providence',
      'barbados',
      'antigua',
      'sharjah',
      'dubai',
      'abu dhabi',
      'galle',
      'colombo',
      'premadasa',
      'pallekele',
      'lahore',
      'gaddafi',
      'karachi',
      'national stadium',
      'rawalpindi',
      'multan',
      'dhaka',
      'shere bangla',
      'chittagong',
      'mirpur',
      'wellington',
      'basin reserve',
      'christchurch',
      'auckland',
      'eden park',
      'hamilton',
    ];

    // Cricket records, stats categories and famous players
    const statsTerms = [
      'highest',
      'lowest',
      'fastest',
      'slowest',
      'most',
      'least',
      'best',
      'worst',
      'record',
      'records',
      'performance',
      'performances',
      'career',
      'debut',
      'retirement',
      'sachin',
      'tendulkar',
      'kohli',
      'virat',
      'dhoni',
      'ponting',
      'lara',
      'warne',
      'mcgrath',
      'kallis',
      'steyn',
      'muralitharan',
      'murali',
      'sangakkara',
      'jayasuriya',
      'wasim',
      'waqar',
      'inzamam',
      'babar',
      'root',
      'stokes',
      'anderson',
      'cook',
      'bradman',
      'gayle',
      'richards',
      'walsh',
      'ambrose',
      'dravid',
      'ganguly',
      'sehwag',
      'bumrah',
      'ashwin',
      'jadeja',
      'shami',
      'rohit',
      'williamson',
      'boult',
      'shakib',
      'rashid',
      'buttler',
      'morgan',
      'warner',
      'smith',
      'cummins',
      'starc',
    ];

    // Check all term categories
    const allTerms = [...cricketTerms, ...venues, ...statsTerms];
    const termMatch = allTerms.some((term) =>
      normalizedQuestion.includes(term),
    );

    if (termMatch) {
      return {
        is_relevant: true,
        reason: 'cricket term detected',
      };
    }

    // 2. Check for follow-up questions that need context
    const isLikelyFollowUp =
      // Short questions are likely follow-ups
      normalizedQuestion.split(' ').length <= 3 ||
      // Contains reference words that indicate continuing a conversation
      [
        'also',
        'what about',
        'and',
        'how about',
        'vs',
        'versus',
        'against',
        'compare',
        'too',
        'as well',
        'instead',
        'alternatively',
        'their',
        'those',
        'these',
        'top',
        'bottom',
        'best',
        'worst',
        'higher',
        'lower',
        'more',
        'less',
      ].some((ref) => normalizedQuestion.includes(ref)) ||
      // Simple pronouns that likely reference previous context
      /\b(it|they|them|this|that)\b/.test(normalizedQuestion) ||
      // Single cricket terms that are likely follow-ups in context
      /^(runs?|wickets?|score|stats|innings|result)\??$/.test(
        normalizedQuestion,
      ) ||
      // Questions that are just team names
      /^(australia|england|india|pakistan|south africa|new zealand)\??$/.test(
        normalizedQuestion,
      );

    // 3. Check memory context for follow-ups
    if (isLikelyFollowUp) {
      try {
        // Get conversation memory
        const memoryContext = await this.memory.retrieveMemory(userId);
        if (
          memoryContext &&
          !memoryContext.includes('No previous conversation history')
        ) {
          // Check if memory contains cricket context
          const cricketContextPattern =
            /\b(cricket|match|odi|test|t20|runs|wickets|innings|score)\b/i;
          if (cricketContextPattern.test(memoryContext)) {
            return {
              is_relevant: true,
              reason: 'follow-up to cricket conversation',
            };
          }
        }
      } catch (error) {
        this.logger.error('Error checking conversation memory:', error);
      }
    }

    // 4. Check for implicit cricket patterns without explicit keywords
    const implicitPatterns = [
      // Match statistics patterns
      /\b(won|lost|beat|defeated|drew|tied)\b.*\b(by|against|versus|vs)\b/i,
      /\b(score|total|chase|target)\b.*(runs?|wickets?)/i,
      /\b(bat|bowl)(ing)?\s+(first|second)\b/i,

      // Date patterns that might be about matches
      /\bin\s+(19|20)\d{2}\b/i,
      /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}\b/i,
    ];

    if (implicitPatterns.some((pattern) => pattern.test(question))) {
      return {
        is_relevant: true,
        reason: 'implicit cricket pattern detected',
      };
    }

    // 5. Use LLM for edge cases
    const prompt = `Determine if this question is about cricket (the sport, not insects).
Consider all aspects including teams, players, matches, stats, and history.

Question: "${question}"

Respond with JSON in this format only: {"is_relevant": true|false, "reason": "explanation"}`;

    try {
      const resp = await this.gemini.generate(prompt, { maxTokens: 100 });
      const parsed = JSON.parse(resp.trim());
      return { is_relevant: !!parsed.is_relevant, reason: parsed.reason };
    } catch (error) {
      this.logger.error('Error in LLM relevancy check:', error);

      // Fallback to basic keyword analysis
      const cricketKeywords = ['cricket', 'match', 'game', 'team', 'score'];
      const hasAnyKeyword = cricketKeywords.some((kw) =>
        normalizedQuestion.includes(kw),
      );

      return {
        is_relevant: hasAnyKeyword,
        reason: hasAnyKeyword ? 'fallback detection' : 'unable to determine',
      };
    }
  }
}
