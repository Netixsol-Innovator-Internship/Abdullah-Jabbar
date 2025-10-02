import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { ProductsModule } from '../products/products.module';
import { SymptomCheckerModule } from '../symptom-checker/symptom-checker.module';

@Module({
  imports: [ProductsModule, SymptomCheckerModule],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
