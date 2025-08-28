import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Use as usual; Passport will add req.user
  canActivate(ctx: ExecutionContext) {
    return super.canActivate(ctx);
  }
}
