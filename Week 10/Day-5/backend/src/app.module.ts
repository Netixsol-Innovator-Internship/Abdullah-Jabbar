import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssignmentsModule } from './assignments/assignments.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/assignments',
      {
        serverSelectionTimeoutMS: 5000, // Reduce timeout
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        maxPoolSize: 10,
        minPoolSize: 1,
      },
    ),
    AssignmentsModule,
    EvaluationModule,
    FilesModule,
  ],
})
export class AppModule {}
