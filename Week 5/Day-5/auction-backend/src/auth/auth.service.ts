import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<boolean> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      return true;
    }
    return false;
  }

  async findUserByUsername(username: string): Promise<UserDocument | null> {
    return this.usersService.findByUsername(username);
  }

  async login(user: UserDocument) {
    const payload = {
      username: user.username,
      sub: user._id,
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<UserDocument> {
    // Check if user already exists
    const existingUser = await this.usersService.findByUsername(username);
    if (existingUser) {
      throw new UnauthorizedException('Username already exists');
    }

    // Check if email already exists
    const existingEmail = await this.usersService.findByEmail(email);
    if (existingEmail) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      username,
      email,
      passwordHash: hashedPassword,
    } as UserDocument;

    return this.usersService.create(userData);
  }
}
