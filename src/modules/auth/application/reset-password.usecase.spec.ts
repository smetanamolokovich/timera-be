import { ResetPasswordUseCase } from './reset-password.usecase';
import { PasswordResetToken } from '../domain/password-reset-token';
import { InvalidPasswordResetTokenError } from '../domain/errors/invalid-password-reset-token.error';
import { User } from '../../users/domain/user';
import type { UserRepository } from '../../users/domain/user.repository';
import type { PasswordResetTokenRepository } from '../domain/password-reset-token.repository.interface';
import type { PasswordHasher } from '../../users/domain/password-hasher';

describe('ResetPasswordUseCase', () => {
  const findById = jest.fn<Promise<User | null>, [string]>();
  const findByEmail = jest.fn<Promise<User | null>, [string]>();
  const saveUser = jest.fn<Promise<void>, [User]>();
  const updateUser = jest.fn<Promise<void>, [User]>();
  const mockUserRepository: UserRepository = {
    findById,
    findByEmail,
    save: saveUser,
    update: updateUser,
  };

  const saveToken = jest.fn<Promise<void>, [PasswordResetToken]>();
  const findByToken = jest.fn<Promise<PasswordResetToken | null>, [string]>();
  const updateToken = jest.fn<Promise<void>, [PasswordResetToken]>();
  const mockPasswordResetTokenRepository: PasswordResetTokenRepository = {
    save: saveToken,
    findByToken,
    update: updateToken,
  };

  const hash = jest.fn<Promise<string>, [string]>();
  const compare = jest.fn<Promise<boolean>, [string, string]>();
  const mockPasswordHasher: PasswordHasher = { hash, compare };

  const useCase = new ResetPasswordUseCase(
    mockUserRepository,
    mockPasswordResetTokenRepository,
    mockPasswordHasher,
  );

  const testUser = new User(
    'user-id',
    'user@example.com',
    'oldhashedpassword',
    new Date(),
    new Date(),
    'John',
    'Doe',
  );

  const validToken = new PasswordResetToken(
    'token-id',
    'user-id',
    'valid-reset-token',
    new Date(Date.now() + 3_600_000),
    new Date(),
    null,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should reset the password and mark the token as used on success', async () => {
    findByToken.mockResolvedValue(validToken);
    findById.mockResolvedValue(testUser);
    hash.mockResolvedValue('newhashedpassword');
    updateUser.mockResolvedValue(undefined);
    updateToken.mockResolvedValue(undefined);

    await useCase.execute('valid-reset-token', 'newPassword123');

    expect(hash).toHaveBeenCalledWith('newPassword123');
    expect(updateUser).toHaveBeenCalledTimes(1);
    expect(updateToken).toHaveBeenCalledTimes(1);
    const updatedToken: PasswordResetToken = updateToken.mock.calls[0][0];
    expect(updatedToken.usedAt).not.toBeNull();
  });

  it('should throw InvalidPasswordResetTokenError when token is not found', async () => {
    findByToken.mockResolvedValue(null);

    await expect(
      useCase.execute('nonexistent-token', 'newPassword123'),
    ).rejects.toThrow(InvalidPasswordResetTokenError);

    expect(hash).not.toHaveBeenCalled();
    expect(updateUser).not.toHaveBeenCalled();
  });

  it('should throw InvalidPasswordResetTokenError when token is expired', async () => {
    const expiredToken = new PasswordResetToken(
      'token-id',
      'user-id',
      'expired-token',
      new Date(Date.now() - 1000),
      new Date(),
      null,
    );
    findByToken.mockResolvedValue(expiredToken);

    await expect(
      useCase.execute('expired-token', 'newPassword123'),
    ).rejects.toThrow(InvalidPasswordResetTokenError);

    expect(hash).not.toHaveBeenCalled();
    expect(updateUser).not.toHaveBeenCalled();
  });

  it('should throw InvalidPasswordResetTokenError when token is already used', async () => {
    const usedToken = new PasswordResetToken(
      'token-id',
      'user-id',
      'used-token',
      new Date(Date.now() + 3_600_000),
      new Date(),
      new Date(),
    );
    findByToken.mockResolvedValue(usedToken);

    await expect(
      useCase.execute('used-token', 'newPassword123'),
    ).rejects.toThrow(InvalidPasswordResetTokenError);

    expect(hash).not.toHaveBeenCalled();
    expect(updateUser).not.toHaveBeenCalled();
  });

  it('should throw InvalidPasswordResetTokenError when user is not found', async () => {
    findByToken.mockResolvedValue(validToken);
    findById.mockResolvedValue(null);

    await expect(
      useCase.execute('valid-reset-token', 'newPassword123'),
    ).rejects.toThrow(InvalidPasswordResetTokenError);

    expect(hash).not.toHaveBeenCalled();
    expect(updateUser).not.toHaveBeenCalled();
  });
});
