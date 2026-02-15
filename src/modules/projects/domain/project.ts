import { InvalidProjectNameError } from './errors/invalid-project-name.error';

export class Project {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public name: string,
    public createdAt: Date,
  ) {
    if (!name || name.length < 3 || name.length > 50) {
      throw new InvalidProjectNameError();
    }
  }
}
