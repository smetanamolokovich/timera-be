import { InvalidWorkTypeNameError } from './errors/invalid-work-type-name.error';

export class WorkType {
  constructor(
    public readonly id: string,
    public readonly projectId: string,
    public readonly name: string,
    public readonly createdAt: Date,
  ) {
    if (!name || name.length < 2 || name.length > 100) {
      throw new InvalidWorkTypeNameError();
    }
  }
}
