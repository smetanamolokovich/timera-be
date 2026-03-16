import { ApplicationError } from '../../../../common/errors/application.error';

export class InvalidPasswordResetTokenError extends ApplicationError {
  readonly statusCode = 400;

  constructor() {
    super('Invalid or expired password reset token');
  }
}
