import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { ApplicationError } from '../errors/application.error';

@Catch()
export class ApplicationExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof ApplicationError) {
      return response.status(exception.statusCode).json({
        statusCode: exception.statusCode,
        message: exception.message,
      });
    }

    return response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}
