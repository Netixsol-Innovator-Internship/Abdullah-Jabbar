import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { IpLoggerService } from './ip-logger.service';
import { IpLoggerMiddleware } from './ip-logger.middleware';

@Module({
  // Database-backed repository temporarily removed; service now writes to a file.
  providers: [IpLoggerService],
  exports: [IpLoggerService],
})
export class IpLoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // apply the middleware to all routes; narrow this to certain routes if desired
    consumer.apply(IpLoggerMiddleware).forRoutes('*');
  }
}
