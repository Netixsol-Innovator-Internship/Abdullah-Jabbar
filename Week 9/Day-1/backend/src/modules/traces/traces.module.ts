import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TraceEntity, TraceSchema } from './schemas/trace.schema';
import { TracesService } from './traces.service';
import { TracesController } from './traces.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: TraceEntity.name, schema: TraceSchema }])],
  providers: [TracesService],
  controllers: [TracesController],
  exports: [TracesService]
})
export class TracesModule {}
