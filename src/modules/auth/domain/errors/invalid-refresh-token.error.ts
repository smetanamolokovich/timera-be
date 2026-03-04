import { ApplicationError } from '../../../../common/errors/application.error';

export class InvalidRefreshTokenError extends ApplicationError {
  readonly statusCode = 401;

  constructor() {
    super('Invalid or expired refresh token');
  }
}
