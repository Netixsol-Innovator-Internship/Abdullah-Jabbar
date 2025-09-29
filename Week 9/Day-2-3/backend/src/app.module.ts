import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AskModule } from './modules/ask/ask.module';
import { UploadModule } from './modules/upload/upload.module';
import { AuthModule } from './modules/auth/auth.module';
import { Match, MatchSchema } from './models/match.schema';
import { TestMatch, TestMatchSchema } from './models/test-match.schema';
import { OdiMatch, OdiMatchSchema } from './models/odi-match.schema';
import { T20Match, T20MatchSchema } from './models/t20-match.schema';
import { User, UserSchema } from './models/user.schema';
import { Conversation, ConversationSchema } from './models/conversation.schema';
import { Summary, SummarySchema } from './models/summary.schema';
import { RelevancyService } from './services/relevancy.service';
import { QueryGeneratorService } from './services/query-generator.service';
import { QueryValidatorService } from './services/query-validator.service';
import { MongoQueryService } from './services/mongo-query.service';
import { FormatterService } from './services/formatter.service';
import { MemoryService } from './services/memory.service';
import { GeminiAdapter } from './ai/gemini-adapter';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/cricket',
    ),
    MongooseModule.forFeature([
      { name: Match.name, schema: MatchSchema },
      { name: TestMatch.name, schema: TestMatchSchema },
      { name: OdiMatch.name, schema: OdiMatchSchema },
      { name: T20Match.name, schema: T20MatchSchema },
      { name: User.name, schema: UserSchema },
      { name: Conversation.name, schema: ConversationSchema },
      { name: Summary.name, schema: SummarySchema },
    ]),
    AskModule,
    UploadModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RelevancyService,
    QueryGeneratorService,
    QueryValidatorService,
    MongoQueryService,
    FormatterService,
    MemoryService,
    GeminiAdapter,
  ],
})
export class AppModule {}
