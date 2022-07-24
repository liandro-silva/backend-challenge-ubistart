import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpTransformResponse } from '@shared';

@Injectable()
export class JwtAuthGuard extends AuthGuard() {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw new HttpException(
        new HttpTransformResponse('Acesso restrito', false, null, null),
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}
