import { Injectable, Logger } from '@nestjs/common';
import { GeminiAdapter } from '../ai/gemini-adapter';

@Injectable()
export class QueryGeneratorService {
  private readonly logger = new Logger(QueryGeneratorService.name);

  constructor(private readonly gemini: GeminiAdapter) {}

  // The prompt includes strict JSON schema examples; LLM must respond with JSON only.
  private readonly promptTemplate = (
    question: string,
    memoryContext?: string,
  ) => `
You are a generator that converts a user's natural language question about cricket match stats into a STRICT JSON query for MongoDB. 

${
  memoryContext
    ? `CONVERSATION CONTEXT:
${memoryContext}

CRITICALLY IMPORTANT - FORMAT SWITCHING IN FOLLOW-UP QUESTIONS:
When a user asks a brief follow-up question that mentions a different cricket format (Test/ODI/T20) 
after previously asking about statistics in another format, they almost always want the SAME TYPE OF STATISTIC
but for the DIFFERENT FORMAT. For example:

- If previous question: "what is highest score in t20?"
- And current question: "what about test" or just "test"
- Then interpret as: "what is highest score in test cricket?"

Always maintain the same query intent (highest score, most wickets, etc.) when format switching occurs,
even if the follow-up question is extremely brief (1-3 words).

Examples of format switching follow-ups:
- "what about odi?" → Apply same query type to ODI format
- "and test?" → Apply same query type to Test format
- "t20?" → Apply same query type to T20 format
- "in one day internationals?" → Apply same query type to ODI format

Use this context to interpret the user's question, especially:
1. Follow-up questions that refer to previous conversations using terms like "also", "what about", "and", "in that match"
2. Comparative terms like "highest", "lowest", "better", "worse", "most", "least" that need previous context
3. Very short questions (1-3 words) that clearly continue the previous conversation
4. Questions with pronouns like "they", "them", "their", "that team" that refer to previously mentioned entities
5. Implicit references to time periods, venues, or statistics discussed earlier
6. User shorthand like "aus" (Australia), "ind" (India), "eng" (England), "pak" (Pakistan), etc.
7. Questions with implied subjects, such as "how many wickets?" after discussing a team
8. Single word follow-ups like "why?", "where?", "when?", "who?", "better?", "worse?", "more?"
9. Contextual references to "the match", "the series", "the tournament", "the player", "the ground"
10. Questions that change just one parameter, like "what about in T20s?" after discussing Tests

For short follow-up questions, maintain continuity with previous questions by preserving teams, formats, time periods, and statistics being discussed.

For ultra-short questions:
- "Better?" → Infer comparison based on previous context
- "Most?" → Infer we're asking for the highest value of previously discussed statistic
- "And ODIs?" → Apply the same analysis from previous question but change format to ODI
- "Who?" → Infer we're asking about which team/player based on previous question
- "Where?" → Infer we're asking about venue/location for previously mentioned match/event
- "Test?" → Apply the same analysis from previous question but change format to Test
`
    : ''
}

Output must be valid JSON and follow this schema:

For regular queries:
{
  "collection": "matches", // Always use "matches" as the collection name
  "filter": { /* required: format: "test"|"odi"|"t20"; allowed fields: team, opposition, ground, result, inns, start_date (ISO string), rpo (number), runs (number), lead (for test matches), wickets, overs, balls, balls_per_over */ },
  "projection": { /* optional key:true map - include all relevant stats fields like runs, wickets, overs, balls, rpo, balls_per_over, inns, lead when detailed stats are requested */ },
  "sort": { /* optional, e.g. { "start_date": -1 } */ },
  "limit": 10
}

For aggregation queries (averages, counts, sums, etc.):
{
  "collection": "matches", // Always use "matches" as the collection name
  "isAggregation": true, // Required for aggregation queries
  "pipeline": [
    { "$match": { /* required: format: "test"|"odi"|"t20"; other filter conditions */ } },
    { "$group": { 
        "_id": "$groupByField", // e.g., "$team", "$ground", null for overall aggregation
        "count": { "$sum": 1 },
        "avgRuns": { "$avg": "$runs" },
        "maxRuns": { "$max": "$runs" },
        "minRuns": { "$min": "$runs" },
        "totalRuns": { "$sum": "$runs" },
        // Add any other aggregations as needed
      }
    },
    { "$sort": { /* optional sorting of aggregated results */ } },
    { "$limit": 20 } // Reasonable default limit
  ]
}

Return dates as ISO strings, numbers as numbers. Do NOT emit any raw JS, $where, or non-whitelisted fields.
IMPORTANT: Always exclude MongoDB internal fields by adding "_id": 0 to all projections.
IMPORTANT: Understand different ways users phrase the same concept. For example:
- When user mentions "score/scores/scored/scoring", map it to the "runs" field in queries
- Handle shorthand: "ton" = century, "50s" = fifties, "wkts" = wickets, "sr" = strike rate
- Recognize formats: "T20/T20I/T20s/twenty20", "ODI/one-day/50-over", "tests/test matches/5-day"

CRITICAL: Always use LOWERCASE format values in MongoDB queries:
- For T20/T20I/T20s/twenty20 → use "t20"
- For ODI/one-day/50-over → use "odi"  
- For Test/test matches/5-day → use "test"
Never use uppercase like "T20", "ODI", "TEST" - always use lowercase "t20", "odi", "test"

CRITICAL: When sorting by numeric fields (runs, wickets, rpo, overs, etc.), always filter out null/undefined values:
- When sorting by "runs", add to filter: "runs": { "$exists": true, "$ne": null }
- When sorting by "wickets", add to filter: "wickets": { "$exists": true, "$ne": null }
- When sorting by "rpo", add to filter: "rpo": { "$exists": true, "$ne": null }
- This ensures you get actual numeric values, not null/undefined values that sort first

IMPORTANT: For date queries, allow for slight flexibility (±2 days) to account for uncertainties and different ways users might refer to dates.

IMPORTANT: When user asks for "full stats", "detailed stats", "complete stats", "all stats", or any variation like "tell me everything about", include comprehensive projection with all statistical fields.

IMPORTANT: For team names, recognize all these variations:
- Full names: "Pakistan", "India", "Australia", "England", "South Africa", etc.
- Abbreviations: "pak", "ind", "aus", "eng", "sa", "nz", "sl", "ban", "afg", "ire", "wi"
- Nicknames: "proteas" (South Africa), "black caps" (New Zealand), "baggy greens" (Australia)
- Partial references: "the Aussies", "the Indians", "the Lankans", etc.

IMPORTANT: For follow-up questions and context management:
- Maintain entities (teams, players, formats) from previous questions when handling follow-ups
- Handle pronouns like "they", "their", "them" - map to most recently mentioned team/player
- For incomplete questions like "how about England?" after "Show India's run rate in ODIs", apply the same analysis type (run rate) to the new entity (England)
- If the user previously asked about India vs Australia, and now asks "what about in ODIs?", keep the same teams
- If the last question was about most runs in T20s, and user asks "and wickets?", maintain the T20 context
- For questions like "between 2010-2015" after asking about a team's performance, apply the date range to the same analysis

IMPORTANT: If the user asks a generic question without specifying a cricket format (Test, ODI, or T20), return an array of 3 queries - one for each format. For format-specific questions, return a single query.

IMPORTANT: If user asks about a specific match without specifying format, default to returning queries for all 3 formats to ensure the match is found.

IMPORTANT: When user asks for averages, totals, highest, lowest, statistics, or uses terms like "average", "mean", "total", "sum", "count", "most", "least", etc., use aggregation queries.

Examples:

# Regular Queries
Q: "Show Australia ODI matches in 2005"
JSON:
{
  "collection":"matches",
  "filter":{ "format":"odi", "team":"Australia", "start_date":{"$gte":"2005-01-01T00:00:00.000Z","$lte":"2005-12-31T23:59:59.999Z"} },
  "projection":{ "_id": 0 },
  "sort":{"start_date":1},
  "limit":100
}

Q: "Top 5 T20 matches with highest team scores"
JSON:
{
  "collection":"matches",
  "filter":{ "format":"t20", "runs": { "$exists": true, "$ne": null } },
  "projection":{ "_id": 0, "team":1, "runs":1, "start_date":1, "ground":1 },
  "sort":{ "runs": -1 },
  "limit": 5
}

Q: "What is the lowest score in test cricket?"
JSON:
{
  "collection":"matches",
  "filter":{ "format":"test", "runs": { "$exists": true, "$ne": null } },
  "projection":{ "_id": 0, "team":1, "runs":1, "opposition":1, "start_date":1, "ground":1 },
  "sort":{ "runs": 1 },
  "limit": 5
}

Q: "What were full stats of Australia vs England at Lord's on 26 Aug 1972 in ODI?"
JSON:
{
  "collection":"matches",
  "filter":{ "format":"odi", "team":{"$in":["Australia","England"]}, "opposition":{"$in":["Australia","England"]}, "ground":"Lord's", "start_date":{ "$gte":"1972-08-24T00:00:00.000Z", "$lte":"1972-08-28T23:59:59.999Z" } },
  "projection":{ "_id": 0, "team":1, "runs":1, "wickets":1, "overs":1, "balls":1, "rpo":1, "balls_per_over":1, "inns":1, "result":1, "opposition":1, "ground":1, "start_date":1 },
  "sort":{ "inns":1 },
  "limit": 10
}

Q: "What was England''s score vs Australia at Lord''s on 25 Aug 1972?" (Date not specific format - check all formats)
JSON:
[
  {
    "collection":"matches",
    "filter":{ "format":"test", "team":"England", "opposition":"Australia", "ground":"Lord''s", "start_date":{ "$gte":"1972-08-24T00:00:00.000Z", "$lte":"1972-08-27T23:59:59.999Z" } },
    "projection":{ "_id": 0 },
    "sort":{},
    "limit": 10
  },
  {
    "collection":"matches",
    "filter":{ "format":"odi", "team":"England", "opposition":"Australia", "ground":"Lord''s", "start_date":{ "$gte":"1972-08-24T00:00:00.000Z", "$lte":"1972-08-27T23:59:59.999Z" } },
    "projection":{ "_id": 0 },
    "sort":{},
    "limit": 10
  },
  {
    "collection":"matches",
    "filter":{ "format":"t20", "team":"England", "opposition":"Australia", "ground":"Lord''s", "start_date":{ "$gte":"1972-08-24T00:00:00.000Z", "$lte":"1972-08-27T23:59:59.999Z" } },
    "projection":{},
    "sort":{},
    "limit": 10
  }
]

Q: "Show India's highest scores" (Generic question - no format specified)
JSON:
[
  {
    "collection":"matches",
    "filter":{ "format":"test", "team":"India" },
    "projection":{ "_id": 0, "team":1, "runs":1, "opposition":1, "start_date":1, "ground":1 },
    "sort":{ "runs": -1 },
    "limit": 5
  },
  {
    "collection":"matches", 
    "filter":{ "format":"odi", "team":"India" },
    "projection":{ "_id": 0, "team":1, "runs":1, "opposition":1, "start_date":1, "ground":1 },
    "sort":{ "runs": -1 },
    "limit": 5
  },
  {
    "collection":"matches",
    "filter":{ "format":"t20", "team":"India" },
    "projection":{ "_id": 0, "team":1, "runs":1, "opposition":1, "start_date":1, "ground":1 },
    "sort":{ "runs": -1 },
    "limit": 5
  }
]

Q: "All matches played at Oval" (Generic venue query - all formats)
JSON:
[
  {
    "collection":"matches",
    "filter":{ "format":"test", "ground":{"$regex":"Oval","$options":"i"} },
    "projection":{ "_id": 0, "team":1, "runs":1, "opposition":1, "start_date":1, "ground":1, "result":1 },
    "sort":{ "start_date": -1 },
    "limit": 50
  },
  {
    "collection":"matches",
    "filter":{ "format":"odi", "ground":{"$regex":"Oval","$options":"i"} },
    "projection":{ "_id": 0, "team":1, "runs":1, "opposition":1, "start_date":1, "ground":1, "result":1 },
    "sort":{ "start_date": -1 },
    "limit": 50
  },
  {
    "collection":"matches",
    "filter":{ "format":"t20", "ground":{"$regex":"Oval","$options":"i"} },
    "projection":{ "_id": 0, "team":1, "runs":1, "opposition":1, "start_date":1, "ground":1, "result":1 },
    "sort":{ "start_date": -1 },
    "limit": 50
  }
]

Q: "All matches of Pakistan" (Generic team query - all formats)
JSON:
[
  {
    "collection":"matches",
    "filter":{ "format":"test", "team":{"$regex":"Pakistan","$options":"i"} },
    "projection":{ "_id": 0, "team":1, "runs":1, "opposition":1, "start_date":1, "ground":1, "result":1 },
    "sort":{ "start_date": -1 },
    "limit": 100
  },
  {
    "collection":"matches",
    "filter":{ "format":"odi", "team":{"$regex":"Pakistan","$options":"i"} },
    "projection":{ "_id": 0, "team":1, "runs":1, "opposition":1, "start_date":1, "ground":1, "result":1 },
    "sort":{ "start_date": -1 },
    "limit": 100
  },
  {
    "collection":"matches",
    "filter":{ "format":"t20", "team":{"$regex":"Pakistan","$options":"i"} },
    "projection":{ "_id": 0, "team":1, "runs":1, "opposition":1, "start_date":1, "ground":1, "result":1 },
    "sort":{ "start_date": -1 },
    "limit": 100
  }
]

Q: "All matches of pak vs ind" (Team vs Team query with abbreviations - expand to full names)
JSON:
[
  {
    "collection":"matches",
    "filter":{ "format":"test", "team":"Pakistan", "opposition":"India" },
    "projection":{ "_id": 0, "team":1, "runs":1, "opposition":1, "start_date":1, "ground":1, "result":1 },
    "sort":{ "start_date": -1 },
    "limit": 100
  },
  {
    "collection":"matches",
    "filter":{ "format":"odi", "team":"Pakistan", "opposition":"India" },
    "projection":{ "_id": 0, "team":1, "runs":1, "opposition":1, "start_date":1, "ground":1, "result":1 },
    "sort":{ "start_date": -1 },
    "limit": 100
  },
  {
    "collection":"matches",
    "filter":{ "format":"t20", "team":"Pakistan", "opposition":"India" },
    "projection":{ "_id": 0, "team":1, "runs":1, "opposition":1, "start_date":1, "ground":1, "result":1 },
    "sort":{ "start_date": -1 },
    "limit": 100
  }
]

# Aggregation Queries
Q: "What's the average score of India in ODIs?"
JSON:
{
  "collection": "matches",
  "isAggregation": true,
  "pipeline": [
    { "$match": { "format": "odi", "team": "India" } },
    { "$group": {
        "_id": null,
        "averageRuns": { "$avg": "$runs" },
        "matchesCount": { "$sum": 1 }
      }
    }
  ]
}

Q: "Show average runs by team in T20 matches"
JSON:
{
  "collection": "matches",
  "isAggregation": true,
  "pipeline": [
    { "$match": { "format": "t20" } },
    { "$group": {
        "_id": "$team",
        "averageRuns": { "$avg": "$runs" },
        "matchesCount": { "$sum": 1 }
      }
    },
    { "$sort": { "averageRuns": -1 } },
    { "$limit": 20 }
  ]
}

Q: "Top 5 grounds with highest average scores in Test matches"
JSON:
{
  "collection": "matches",
  "isAggregation": true,
  "pipeline": [
    { "$match": { "format": "test" } },
    { "$group": {
        "_id": "$ground",
        "averageRuns": { "$avg": "$runs" },
        "highestRuns": { "$max": "$runs" },
        "matchesCount": { "$sum": 1 }
      }
    },
    { "$match": { "matchesCount": { "$gt": 5 } } },
    { "$sort": { "averageRuns": -1 } },
    { "$limit": 5 }
  ]
}

Q: "Compare average runs scored by England and Australia in ODIs"
JSON:
{
  "collection": "matches",
  "isAggregation": true,
  "pipeline": [
    { "$match": { "format": "odi", "team": { "$in": ["England", "Australia"] } } },
    { "$group": {
        "_id": "$team",
        "averageRuns": { "$avg": "$runs" },
        "highestScore": { "$max": "$runs" },
        "lowestScore": { "$min": "$runs" },
        "totalMatches": { "$sum": 1 }
      }
    },
    { "$sort": { "averageRuns": -1 } }
  ]
}

Now produce JSON for the following question. 
${memoryContext ? 'Remember to use the conversation context above to understand any references to previous discussions.' : ''}
Question: """${question}"""
`;

  async generateQuery(question: string, memoryContext?: string) {
    // Preprocess question to help handle variations in phrasing and shorthand
    const preprocessedQuestion = this.preprocessQuestion(question);

    // Use the enhanced question with the prompt template
    const prompt = this.promptTemplate(preprocessedQuestion, memoryContext);

    // Log the original vs preprocessed question for debugging
    if (preprocessedQuestion !== question) {
      this.logger.debug('Preprocessed question for better understanding', {
        original: question,
        preprocessed: preprocessedQuestion,
      });
    }

    // Returns raw text (LLM stub). Here we call adapter
    // Increase token limit to handle complex queries
    const resp = await this.gemini.generate(prompt, { maxTokens: 2048 });

    // Clean the response by removing markdown code blocks
    let cleanedResp = resp.trim();

    // Remove markdown code block markers
    if (cleanedResp.startsWith('```json')) {
      cleanedResp = cleanedResp.replace(/^```json\s*/, '');
    }
    if (cleanedResp.startsWith('```')) {
      cleanedResp = cleanedResp.replace(/^```\s*/, '');
    }
    if (cleanedResp.endsWith('```')) {
      cleanedResp = cleanedResp.replace(/\s*```$/, '');
    }

    // We expect JSON only. Try parse; if fails, attempt to extract JSON substring.
    // Handle both single objects {} and arrays []
    const firstBrace = cleanedResp.indexOf('{');
    const firstBracket = cleanedResp.indexOf('[');
    const lastBrace = cleanedResp.lastIndexOf('}');
    const lastBracket = cleanedResp.lastIndexOf(']');

    let jsonText: string;

    // Determine if response is an array or object
    if (firstBracket >= 0 && (firstBracket < firstBrace || firstBrace === -1)) {
      // Array response
      jsonText =
        lastBracket > firstBracket
          ? cleanedResp.slice(firstBracket, lastBracket + 1)
          : cleanedResp;
    } else {
      // Object response
      jsonText =
        firstBrace >= 0 && lastBrace > firstBrace
          ? cleanedResp.slice(firstBrace, lastBrace + 1)
          : cleanedResp;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const parsedResult = JSON.parse(jsonText);
      this.logger.debug(
        `Successfully parsed JSON: ${JSON.stringify(parsedResult, null, 2)}`,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return parsedResult;
    } catch (parseError) {
      this.logger.error(`Failed to parse JSON. Raw response: ${resp}`);
      this.logger.error(`Cleaned response: ${cleanedResp}`);
      this.logger.error(`Extracted JSON text: ${jsonText}`);
      this.logger.error(
        `Parse error: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
      );
      throw new Error(
        `QueryGenerator produced invalid JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Preprocesses user questions to handle variations in phrasing, shorthand, and incomplete follow-ups
   * @param question The original user question
   * @returns A potentially expanded or clarified question
   */
  private preprocessQuestion(question: string): string {
    if (!question) return question;

    let processed = question.trim();

    // 1. Normalize common cricket terms and abbreviations
    const termMappings: Record<string, string> = {
      // Format abbreviations (keep lowercase for MongoDB schema compatibility)
      t20i: 't20',
      t20s: 't20',
      twenty20: 't20',
      'twenty 20': 't20',
      '20 20': 't20',
      'one day': 'odi',
      'one-day': 'odi',
      oneday: 'odi',
      odis: 'odi',
      '50 over': 'odi',
      '50-over': 'odi',
      'fifty over': 'odi',
      'test match': 'test',
      'test matches': 'test',
      tests: 'test',
      '5 day': 'test',
      '5-day': 'test',
      'five day': 'test',
      // Team abbreviations
      ind: 'India',
      aus: 'Australia',
      eng: 'England',
      pak: 'Pakistan',
      nz: 'New Zealand',
      sa: 'South Africa',
      sl: 'Sri Lanka',
      wi: 'West Indies',
      ban: 'Bangladesh',
      zim: 'Zimbabwe',
      // Common cricket terms
      rpo: 'runs per over',
      sr: 'strike rate',
      avg: 'average',
      // Scoring terms
      tons: 'centuries',
      ton: 'century',
      '50s': 'fifties',
      '100s': 'centuries',
      '200s': 'double centuries',
    };

    // Replace standalone terms (with word boundaries)
    for (const [abbr, full] of Object.entries(termMappings)) {
      const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
      processed = processed.replace(regex, full);
    }

    // Additional explicit format normalization to ensure lowercase format values
    processed = processed.replace(/\bT20I?\b/gi, 't20');
    processed = processed.replace(/\bODI\b/gi, 'odi');
    processed = processed.replace(/\bTEST\b/gi, 'test');
    processed = processed.replace(/\bTest\b/g, 'test'); // Preserve case sensitivity for proper nouns

    // 2. Expand common shorthand patterns
    const shorthandPatterns: Array<[RegExp, string]> = [
      // "X vs Y" -> "matches between X versus Y"
      [/^(\w+)\s+vs\.?\s+(\w+)$/i, 'matches between $1 versus $2'],
      // "X in year" -> "X matches in year"
      [/^(\w+)\s+in\s+(19|20)\d{2}$/i, '$1 matches in $2'],
      // Single terms with question marks -> "Show me information about X"
      [/^(\w+)\??$/i, 'Show information about $1 in cricket'],
      // "Most X" -> "Most X in cricket"
      [/^most\s+(\w+)$/i, 'Most $1 in cricket matches'],
      // "Best X" -> "Best X in cricket"
      [/^best\s+(\w+)$/i, 'Best $1 in cricket matches'],
      // "X?" -> "What about X in cricket?"
      [/^what\s+about\s+(.+?)\??$/i, 'Show me information about $1 in cricket'],
      // Common comparative shorthand
      [
        /^better\??$/i,
        'Which team has better performance in recent cricket matches',
      ],
      [/^highest\??$/i, 'What is the highest score in cricket matches'],
      [/^lowest\??$/i, 'What is the lowest score in cricket matches'],
      // Single word follow-up questions with specific meanings
      [
        /^who\??$/i,
        'Who was involved in the previously mentioned cricket context',
      ],
      [
        /^when\??$/i,
        'When did the previously mentioned cricket match or event occur',
      ],
      [
        /^where\??$/i,
        'Where was the previously mentioned cricket match played',
      ],
      [
        /^why\??$/i,
        'Why did that result happen in the cricket context we were discussing',
      ],
      [
        /^how\??$/i,
        'How did that happen in the cricket match we were discussing',
      ],
      // Comparison follow-ups
      [
        /^compared\s+to\s+(.+?)\??$/i,
        'Compare with $1 in the same cricket context',
      ],
      [/^vs\.?\s+(.+?)\??$/i, 'Compare with $1 in the same cricket context'],
      // Shorthand "and X" follow-ups
      [
        /^and\s+(in|for|at|by|when)\s+(.+?)\??$/i,
        'Show cricket information $1 $2 in the same context',
      ],
      // Time period follow-ups
      [
        /^in\s+(19|20)\d{2}(\s*-\s*(19|20)\d{2})?\??$/i,
        'Show the same cricket statistics but for time period $1$2',
      ],
      [
        /^during\s+(.+?)\??$/i,
        'Show the same cricket statistics but during $1',
      ],
      // Format-specific follow-ups
      [
        /^in\s+(test|odi|t20)s?\??$/i,
        'Show the same cricket statistics but in $1 format',
      ],
    ];

    // Apply shorthand expansion patterns
    for (const [pattern, replacement] of shorthandPatterns) {
      if (pattern.test(processed)) {
        processed = processed.replace(pattern, replacement);
        break; // Only apply one transformation
      }
    }

    // 3. Handle incomplete follow-ups by adding context
    if (
      processed.split(' ').length <= 3 &&
      !/\bcricket\b/i.test(processed) &&
      !/\bmatch(es)?\b/i.test(processed)
    ) {
      // Very short query without explicit cricket context
      processed = `${processed} in cricket matches`;
    }

    return processed;
  }
}
