import { ApplicationError } from './application.error';

export class AccessDeniedError extends ApplicationError {
  statusCode = 403;

  constructor() {
    super('Access denied');
  }
}
