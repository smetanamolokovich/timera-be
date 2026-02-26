import { ApplicationError } from './application.error';

export class NotFoundError extends ApplicationError {
  readonly statusCode = 404;

  constructor(message: string = 'Not Found') {
    super(message);
  }
}
