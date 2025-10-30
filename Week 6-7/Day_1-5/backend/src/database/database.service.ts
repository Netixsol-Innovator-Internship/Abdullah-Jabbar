
// database.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit() {
    this.connection.on('connected', () => {
      console.log('✅ MongoDB connected');
    });

    this.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    this.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });
  }
}
