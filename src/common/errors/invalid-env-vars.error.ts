import { ApplicationError } from './application.error';

export class InvalidEnvVarsError extends ApplicationError {
  readonly statusCode = 500;

  constructor(missingVars: string[]) {
    super(`Invalid environment variables: ${missingVars.join(', ')}`);
  }
}
