import { ApplicationError } from './application.error';

export class ValidationError extends ApplicationError {
  readonly statusCode = 422;

  constructor(message: string) {
    super(message);
  }
}
