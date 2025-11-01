import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssignmentsModule } from './assignments/assignments.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        const uri =
          process.env.MONGODB_URI || 'mongodb://localhost:27017/assignments';

        console.log('🔌 Attempting MongoDB connection...');
        console.log(
          'MongoDB URI:',
          uri.replace(/\/\/([^:]+):([^@]+)@/, '//*****:*****@'),
        ); // Log without credentials

        return {
          uri,
          // Optimized for serverless environments
          serverSelectionTimeoutMS: 15000, // Increased for Vercel
          socketTimeoutMS: 45000,
          connectTimeoutMS: 15000, // Increased for cold starts
          maxPoolSize: 5, // Reduced for serverless
          minPoolSize: 0, // Allow connections to close
          retryWrites: true,
          retryReads: true,
          // Important for serverless
          maxIdleTimeMS: 30000,
          // Handle connection events
          autoIndex: false, // Don't build indexes on connection
        };
      },
    }),
    AssignmentsModule,
    EvaluationModule,
    FilesModule,
  ],
})
export class AppModule {}
