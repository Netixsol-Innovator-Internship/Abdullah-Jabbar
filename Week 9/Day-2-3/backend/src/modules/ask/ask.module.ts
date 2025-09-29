import { Module } from '@nestjs/common';
import { AskController } from './ask.controller';
import { AskService } from './ask.service';
import { RelevancyService } from '../../services/relevancy.service';
import { QueryGeneratorService } from '../../services/query-generator.service';
import { QueryValidatorService } from '../../services/query-validator.service';
import { MongoQueryService } from '../../services/mongo-query.service';
import { FormatterService } from '../../services/formatter.service';
import { MemoryService } from '../../services/memory.service';
import { GeminiAdapter } from '../../ai/gemini-adapter';
import { MongooseModule } from '@nestjs/mongoose';
import { TestMatch, TestMatchSchema } from '../../models/test-match.schema';
import { OdiMatch, OdiMatchSchema } from '../../models/odi-match.schema';
import { T20Match, T20MatchSchema } from '../../models/t20-match.schema';
import {
  Conversation,
  ConversationSchema,
} from '../../models/conversation.schema';
import { Summary, SummarySchema } from '../../models/summary.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TestMatch.name, schema: TestMatchSchema },
      { name: OdiMatch.name, schema: OdiMatchSchema },
      { name: T20Match.name, schema: T20MatchSchema },
      { name: Conversation.name, schema: ConversationSchema },
      { name: Summary.name, schema: SummarySchema },
    ]),
  ],
  controllers: [AskController],
  providers: [
    AskService,
    RelevancyService,
    QueryGeneratorService,
    QueryValidatorService,
    MongoQueryService,
    FormatterService,
    MemoryService,
    GeminiAdapter,
  ],
})
export class AskModule {}
