import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApplicationError } from '../errors/application.error';

@Catch()
export class ApplicationExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    // HttpException (401, 400, 403...)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorResponse = exception.getResponse();

      return response
        .status(status)
        .json(
          typeof errorResponse === 'string'
            ? { statusCode: status, message: errorResponse }
            : { statusCode: status, ...errorResponse },
        );
    }

    // ApplicationError
    if (exception instanceof ApplicationError) {
      return response.status(exception.statusCode).json({
        statusCode: exception.statusCode,
        message: exception.message,
      });
    }

    console.error('Unhandled exception:', exception);

    return response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}
