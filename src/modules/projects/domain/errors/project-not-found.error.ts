import { NotFoundError } from '../../../../common/errors/not-found.errors';

export class ProjectNotFoundError extends NotFoundError {
  constructor() {
    super('Project not found');
  }
}
