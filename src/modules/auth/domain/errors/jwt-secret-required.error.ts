import { ApplicationError } from '../../../../common/errors/application.error';

export class JwtSecretRequiredError extends ApplicationError {
  readonly statusCode = 500;

  constructor() {
    super('JWT secret is required but not defined in environment variables');
  }
}
