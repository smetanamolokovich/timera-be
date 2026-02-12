export class User {
  constructor(
    public readonly id: string,
    public email: string,
    private passwordHash: string,
    public createdAt: Date,
  ) {
    this.validateEmail(email);
  }

  private validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  public changePassword(newPasswordHash: string) {
    if (!newPasswordHash || newPasswordHash.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    this.passwordHash = newPasswordHash;
  }

  public getPasswordHash(): string {
    return this.passwordHash;
  }
}
