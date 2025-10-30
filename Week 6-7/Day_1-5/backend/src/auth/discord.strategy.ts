
// discord.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-discord';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    const options: StrategyOptions = {
      clientID: configService.get('DISCORD_CLIENT_ID') || '',
      clientSecret: configService.get('DISCORD_CLIENT_SECRET') || '',
      callbackURL:
        configService.get('DISCORD_CALLBACK_URL') ||
        'http://localhost:4000/auth/discord/callback',
      scope: ['identify', 'email'],
    };
    super(options);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    try {
      const { username, email, avatar } = profile;

      if (!email) {
        throw new Error('No email found in Discord profile');
      }

      const user = await this.authService.validateOrCreateOAuthUser({
        email,
        name: username,
        provider: 'discord',
        providerId: profile.id,
        picture: avatar
          ? `https://cdn.discordapp.com/avatars/${profile.id}/${avatar}.png`
          : undefined,
      });

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
