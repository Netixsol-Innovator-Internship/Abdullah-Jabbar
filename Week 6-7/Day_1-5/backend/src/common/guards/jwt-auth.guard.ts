// jwt-auth.guard.ts
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // If there's an error or no user, throw a proper UnauthorizedException
    if (err || !user) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Authentication required. Please provide a valid JWT token.',
        error: 'Unauthorized',
      });
    }
    return user;
  }
}