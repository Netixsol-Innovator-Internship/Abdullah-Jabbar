import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IpLoggerService } from './ip-logger.service';
import { IpLoggerMiddleware } from './ip-logger.middleware';
import { IpLoggerController } from './ip-logger.controller';
import { IpLog, IpLogSchema } from './ip-log.entity';
import { IpResourceLog, IpResourceLogSchema } from './ip-resource-log.entity';
import { IpOtherLog, IpOtherLogSchema } from './ip-other-log.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IpLog.name, schema: IpLogSchema },
      { name: IpResourceLog.name, schema: IpResourceLogSchema },
      { name: IpOtherLog.name, schema: IpOtherLogSchema },
    ]),
  ],
  controllers: [IpLoggerController],
  providers: [IpLoggerService],
  exports: [IpLoggerService],
})
export class IpLoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // apply the middleware to all routes; narrow this to certain routes if desired
    consumer.apply(IpLoggerMiddleware).forRoutes('*');
  }
}
