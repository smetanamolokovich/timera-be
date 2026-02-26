import { ApplicationError } from '../../../../common/errors/application.error';

export class InvalidInvitationTokenError extends ApplicationError {
  readonly statusCode = 400;

  constructor() {
    super('Invalid invitation token');
  }
}
