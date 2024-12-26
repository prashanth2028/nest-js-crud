import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface Response<T> {
  message: string;
  status: boolean;
  data: any;
  error: null;
  timestamps: Date;
  status_code: number;
}

export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const statusCode = context.switchToHttp().getResponse().statusCode;
    const path = context.switchToHttp().getRequest().url;
    return next.handle().pipe(
      map((data) => ({
        message: data.message,
        status: data.success,
        data: data.data,
        timestamps: new Date(),
        status_code: statusCode,
        path,
        error: null,
      })),
    );
  }
}
