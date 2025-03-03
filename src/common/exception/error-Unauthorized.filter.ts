import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const result = exception.getResponse() as { message: any; error: any; statusCode: number };
    const message = result.message;
    const statusCode = result.statusCode;
    const error = result.error;

    response.status(statusCode).json({
      message,
      error: error || 'UNAUTHORIZED',
      statusCode,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
