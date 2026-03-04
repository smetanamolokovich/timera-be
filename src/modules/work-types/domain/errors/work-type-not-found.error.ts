import { NotFoundError } from '../../../../common/errors/not-found.errors';

export class WorkTypeNotFoundError extends NotFoundError {
  constructor() {
    super('Work type not found');
  }
}
