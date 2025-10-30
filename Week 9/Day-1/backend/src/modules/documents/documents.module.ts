import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Doc, DocumentSchema } from './schemas/document.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Doc.name, schema: DocumentSchema }])],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService]
})
export class DocumentsModule {}
