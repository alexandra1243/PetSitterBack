import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException } from '@nestjs/common';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  public intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next
      .handle()
      .pipe(tap(response => {
        if (null === response || undefined === response) {
          throw new NotFoundException();
        }
      }));
  }
}