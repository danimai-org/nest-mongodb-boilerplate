import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const data = exception.getResponse();

    response.status(status).json({
      statusCode: status,
      message: typeof data === 'string' ? data : undefined,
      errors:
        typeof data === 'object' && !Object.keys(data).includes('errors')
          ? data
          : undefined,
      ...(typeof data === 'object' && Object.keys(data).includes('errors')
        ? data
        : {}),
    });
  }
}
