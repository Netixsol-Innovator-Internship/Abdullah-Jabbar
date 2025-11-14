import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { IpLoggerModule } from './ip-logger/ip-logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/ip-tracker',
      {
        // Serverless optimizations for Vercel
        maxPoolSize: 10, // Limit connections for serverless
        minPoolSize: 1, // Keep at least 1 connection warm
        serverSelectionTimeoutMS: 5000, // Fail fast if can't connect
        socketTimeoutMS: 45000, // Socket timeout
        family: 4, // Use IPv4, skip IPv6 for faster connection
        // Keep connections alive during idle periods
        maxIdleTimeMS: 60000, // Close idle connections after 60s
        // Retry writes for transient failures
        retryWrites: true,
        retryReads: true,
        // Connection monitoring
        heartbeatFrequencyMS: 10000,
        // Enable auto-reconnect
        autoIndex: true,
      },
    ),
    IpLoggerModule,
  ],
})
export class AppModule {}
