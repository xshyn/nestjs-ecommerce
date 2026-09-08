import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs';

export interface ResponseEnvelope<T> {
  count: number;
  data: T | T[];
}

export class ResponseEnvelopeInterceptor<T> implements NestInterceptor<
  T,
  ResponseEnvelope<T>
> {
  intercept(ctx: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((val) => {
        return {
          count: Array.isArray(val) ? val.length : 1,
          data: val,
        };
      }),
    );
  }
}
