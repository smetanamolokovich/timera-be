import { ApplicationError } from '../../../../common/errors/application.error';

export class InvalidEmailOrPasswordError extends ApplicationError {
  readonly statusCode = 401;

  constructor() {
    super('Invalid email or password');
  }
}
