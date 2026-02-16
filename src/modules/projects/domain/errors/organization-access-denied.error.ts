import { ApplicationError } from '../../../../common/errors/application.error';

export class OrganizationAccessDeniedError extends ApplicationError {
  statusCode = 400;

  constructor() {
    super('User is required to create a project');
  }
}
