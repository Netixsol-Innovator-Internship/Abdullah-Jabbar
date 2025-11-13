import { Module } from '@nestjs/common';
import { IpLoggerModule } from './ip-logger/ip-logger.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // optional but recommended
    // TypeORM / database temporarily disabled for local dev. To re-enable,
    // restore the TypeOrmModule.forRootAsync(...) block and install the DB driver.
    IpLoggerModule,
  ],
})
export class AppModule {}
