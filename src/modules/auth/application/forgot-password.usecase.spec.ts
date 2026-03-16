import { ForgotPasswordUseCase } from './forgot-password.usecase';
import { PasswordResetToken } from '../domain/password-reset-token';
import { User } from '../../users/domain/user';
import type { UserRepository } from '../../users/domain/user.repository';
import type { PasswordResetTokenRepository } from '../domain/password-reset-token.repository.interface';
import type { EmailService } from '../../email/domain/email.service.interface';
import { ConfigService } from '@nestjs/config';

describe('ForgotPasswordUseCase', () => {
  const findByEmail = jest.fn<Promise<User | null>, [string]>();
  const saveUser = jest.fn<Promise<void>, [User]>();
  const findById = jest.fn<Promise<User | null>, [string]>();
  const updateUser = jest.fn<Promise<void>, [User]>();
  const mockUserRepository: UserRepository = {
    findByEmail,
    save: saveUser,
    findById,
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

  const sendPasswordReset = jest.fn<Promise<void>, [string, string]>();
  const sendInvitation = jest.fn<Promise<void>, [string, string, string]>();
  const mockEmailService: EmailService = {
    sendInvitation,
    sendPasswordReset,
  };

  const mockConfigService = {
    getOrThrow: jest.fn().mockReturnValue('http://localhost:3000'),
  } as unknown as ConfigService;

  const useCase = new ForgotPasswordUseCase(
    mockUserRepository,
    mockPasswordResetTokenRepository,
    mockEmailService,
    mockConfigService,
  );

  const testUser = new User(
    'user-id',
    'user@example.com',
    'hashedpassword',
    new Date(),
    new Date(),
    'John',
    'Doe',
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save a reset token and send an email when user exists', async () => {
    findByEmail.mockResolvedValue(testUser);
    saveToken.mockResolvedValue(undefined);
    sendPasswordReset.mockResolvedValue(undefined);

    await useCase.execute('user@example.com');

    expect(saveToken).toHaveBeenCalledTimes(1);
    const savedToken: PasswordResetToken = saveToken.mock.calls[0][0];
    expect(savedToken.userId).toBe('user-id');
    expect(savedToken.token).toHaveLength(64); // 32 bytes as hex
    expect(savedToken.usedAt).toBeNull();
    expect(savedToken.expiresAt.getTime()).toBeGreaterThan(Date.now());

    expect(sendPasswordReset).toHaveBeenCalledTimes(1);
    expect(sendPasswordReset).toHaveBeenCalledWith(
      'user@example.com',
      expect.stringContaining(savedToken.token),
    );
  });

  it('should return without saving or sending email when user does not exist', async () => {
    findByEmail.mockResolvedValue(null);

    await useCase.execute('nonexistent@example.com');

    expect(saveToken).not.toHaveBeenCalled();
    expect(sendPasswordReset).not.toHaveBeenCalled();
  });

  it('should still succeed even if email sending fails', async () => {
    findByEmail.mockResolvedValue(testUser);
    saveToken.mockResolvedValue(undefined);
    sendPasswordReset.mockRejectedValue(new Error('SMTP error'));

    await expect(useCase.execute('user@example.com')).resolves.toBeUndefined();
    expect(saveToken).toHaveBeenCalledTimes(1);
  });
});
