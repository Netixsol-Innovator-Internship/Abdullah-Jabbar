/* eslint-disable prettier/prettier */
// app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FollowersModule } from './followers/followers.module';
import { CommentModule } from './comment/comment.module';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): MongooseModuleOptions => {
        const uri =
          configService.get<string>('MONGO_URI') ||
          'mongodb+srv://leoplaner211:123@cluster0.tflkmvi.mongodb.net/backend-app';

        console.log(
          '🔗 Connecting to MongoDB:',
          uri.replace(/\/\/[^:]*:[^@]*@/, '//***:***@'),
        );

        if (!uri) {
          throw new Error('MONGO_URI environment variable is not set');
        }

        return {
          uri,
          retryWrites: true,
          w: 'majority',
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    FollowersModule,
    CommentModule,
    LikesModule,
  ],
})
export class AppModule {
  constructor() {
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });
  }
}
