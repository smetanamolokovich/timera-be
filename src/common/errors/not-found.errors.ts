import { ApplicationError } from './application.error';

export abstract class NotFoundError extends ApplicationError {
  readonly statusCode = 404;

  constructor(message: string) {
    super(message);
  }
}
