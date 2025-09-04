import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const valid = await bcrypt.compare(pass, user.passwordHash);
    if (valid) {
      const { passwordHash, ...rest } = user.toObject ? user.toObject() : user;
      return rest;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user._id, email: user.email, roles: user.roles || ['user'] };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Simple register helper
  async register(payload: { email: string; password: string; name?: string }) {
    const passwordHash = await bcrypt.hash(payload.password, 10);
    const user = await this.usersService.create({
      email: payload.email,
      passwordHash,
      name: payload.name,
    });
    return this.login(user);
  }
}