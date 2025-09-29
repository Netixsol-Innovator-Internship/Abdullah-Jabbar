import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TestMatch, TestMatchSchema } from '../../models/test-match.schema';
import { OdiMatch, OdiMatchSchema } from '../../models/odi-match.schema';
import { T20Match, T20MatchSchema } from '../../models/t20-match.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TestMatch.name, schema: TestMatchSchema },
      { name: OdiMatch.name, schema: OdiMatchSchema },
      { name: T20Match.name, schema: T20MatchSchema },
    ]),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
