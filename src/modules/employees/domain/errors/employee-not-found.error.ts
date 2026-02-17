import { NotFoundError } from '../../../../common/errors/not-found.errors';

export class EmployeeNotFoundError extends NotFoundError {
  constructor() {
    super('Employee not found');
  }
}
