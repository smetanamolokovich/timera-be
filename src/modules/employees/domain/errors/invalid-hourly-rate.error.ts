import { ApplicationError } from '../../../../common/errors/application.error';

export class InvalidHourlyRateError extends ApplicationError {
  readonly statusCode = 422;

  constructor() {
    super('Hourly rate must be a non-negative number');
  }
}
