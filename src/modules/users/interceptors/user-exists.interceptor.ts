import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { HttpTransformResponse, Contract } from '@shared';
import { UsersService } from '@users-services';

@Injectable()
export class UserExistsInterceptor implements NestInterceptor {
  constructor(public readonly usersService: UsersService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const body = context.switchToHttp().getRequest().body;

    return next.handle();
  }
}
