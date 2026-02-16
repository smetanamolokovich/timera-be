import { InvalidTimeEntryError } from './errors/invalid-time-entry.error';

export class TimeEntry {
  constructor(
    public readonly id: string,
    public readonly projectId: string,
    public readonly employeeId: string,
    public readonly workTypeId: string,
    public readonly description: string,
    public readonly hours: number,
    public readonly date: Date,
    public readonly createdAt: Date,
  ) {
    if (!description || description.length < 3 || description.length > 255) {
      throw new InvalidTimeEntryError('Description must be 3-255 characters');
    }

    if (hours <= 0 || hours > 24) {
      throw new InvalidTimeEntryError('Hours must be between 0 and 24');
    }
  }
}
