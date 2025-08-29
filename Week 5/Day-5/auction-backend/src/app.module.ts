import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { MongooseModule, InjectConnection } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';

import { UsersModule } from './users/users.module';
import { CarsModule } from './cars/cars.module';
import { BidsModule } from './bids/bids.module';
import { PaymentsModule } from './payments/payments.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CategoriesModule } from './categories/categories.module';
import { AuctionsModule } from './auctions/auctions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuthModule } from './auth/auth.module';

// import { AppGateway } from './app.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    CarsModule,
    BidsModule,
    PaymentsModule,
    WishlistModule,
    CategoriesModule,
    AuctionsModule,
    NotificationsModule,
  ],
  // providers: [AppGateway],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private configService: ConfigService,
  ) {}

  onModuleInit() {
    const mongoUri = this.configService.get<string>('MONGO_URI');
    this.logger.log(`MONGO_URI from ConfigService: ${mongoUri}`);

    if (this.connection.readyState === 1) {
      this.logger.log('Successfully connected to MongoDB.');
    } else {
      this.connection.once('open', () => {
        this.logger.log('Successfully connected to MongoDB.');
      });
      this.connection.on('error', (error) => {
        this.logger.error('MongoDB connection error:', error);
      });
    }
  }
}
