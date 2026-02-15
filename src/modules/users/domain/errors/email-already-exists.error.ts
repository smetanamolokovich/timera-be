import { ApplicationError } from '../../../../common/errors/application.error';

export class EmailAlreadyExistsError extends ApplicationError {
  readonly statusCode = 409;

  constructor() {
    super('Email is already in use');
  }
}
