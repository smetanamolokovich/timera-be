import { NotFoundError } from '../../../../common/errors/not-found.errors';

export class TimeEntryNotFoundError extends NotFoundError {
  constructor() {
    super('Time entry not found');
  }
}
