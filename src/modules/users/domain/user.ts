export class User {
  constructor(
    public readonly id: string,
    public email: string,
    private passwordHash: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public firstName: string,
    public lastName: string,
    public timezone?: string,
    public locale?: string,
    public avatarUrl?: string,
    public phone?: string,
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
