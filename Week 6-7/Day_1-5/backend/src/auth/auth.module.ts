
// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './google.strategy';
import { GitHubStrategy } from './github.strategy';
import { DiscordStrategy } from './discord.strategy';
import { AuthController } from './auth.controller';
import { OtpModule } from '../otp/otp.module';

@Module({
  imports: [
    UsersModule,
    OtpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'changeme',
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') || '3600s',
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    GitHubStrategy,
    DiscordStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}