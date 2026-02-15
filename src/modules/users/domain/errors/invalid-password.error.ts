import { ApplicationError } from '../../../../common/errors/application.error';

export class InvalidPasswordError extends ApplicationError {
  readonly statusCode = 422;

  constructor() {
    super('Password must be at least 8 characters long');
  }
}
