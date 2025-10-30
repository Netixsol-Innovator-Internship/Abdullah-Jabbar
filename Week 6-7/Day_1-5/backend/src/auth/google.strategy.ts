
// google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET') || '',
      callbackURL:
        configService.get('GOOGLE_CALLBACK_URL') ||
        'http://localhost:4000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { name, emails, photos } = profile;
      const email = emails[0].value;

      const user = await this.authService.validateOrCreateOAuthUser({
        email,
        name: `${name.givenName} ${name.familyName}`,
        provider: 'google',
        providerId: profile.id,
        picture: photos[0]?.value,
      });

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
