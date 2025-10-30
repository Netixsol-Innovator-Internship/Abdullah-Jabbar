
// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'changeme',
    });
  }

  async validate(payload: { sub?: string; email?: string; roles?: string[] }) {
    const id = payload && (payload.sub as unknown as string);
    if (!id) return null;
    const user = await this.usersService.findById(id);
    if (!user) return null;
    // return full user object attached to request
    return user;
  }
}