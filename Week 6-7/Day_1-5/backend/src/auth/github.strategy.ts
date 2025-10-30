
// github.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get('GITHUB_CLIENT_ID') || '',
      clientSecret: configService.get('GITHUB_CLIENT_SECRET') || '',
      callbackURL:
        configService.get('GITHUB_CALLBACK_URL') ||
        'http://localhost:4000/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    try {
      const { username, displayName, emails, photos } = profile;
      const email = emails && emails[0] ? emails[0].value : null;

      if (!email) {
        throw new Error('No email found in GitHub profile');
      }

      const user = await this.authService.validateOrCreateOAuthUser({
        email,
        name: displayName || username,
        provider: 'github',
        providerId: profile.id,
        picture: photos[0]?.value,
      });

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
