import { ApplicationError } from '../../../../common/errors/application.error';

export class InvalidWorkTypeNameError extends ApplicationError {
  statusCode = 400;

  constructor() {
    super('Invalid work type name. Name must be between 2 and 100 characters.');
  }
}
