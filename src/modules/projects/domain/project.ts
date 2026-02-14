export class Project {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public name: string,
    public createdAt: Date,
  ) {}
}
