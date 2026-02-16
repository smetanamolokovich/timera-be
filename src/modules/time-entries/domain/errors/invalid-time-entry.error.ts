import { ApplicationError } from '../../../../common/errors/application.error';

export class InvalidTimeEntryError extends ApplicationError {
  statusCode = 400;

  constructor(message: string) {
    super(message);
  }
}
