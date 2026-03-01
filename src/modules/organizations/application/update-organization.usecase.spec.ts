import { UpdateOrganizationUseCase } from './update-organization.usecase';
import { NotFoundError } from '../../../common/errors/not-found.errors';
import { OrganizationIdRequiredError } from '../../../common/errors/organization-id-required.error';
import { Organization } from '../domain/organization';
import type { OrganizationRepository } from '../domain/interfaces/organization.interface';

describe('UpdateOrganizationUseCase', () => {
  const save = jest.fn<Promise<void>, [Organization]>();
  const findById = jest.fn<Promise<Organization | null>, [string]>();
  const update = jest.fn<Promise<void>, [Organization]>();
  const mockOrganizationRepository: OrganizationRepository = {
    save,
    findById,
    update,
  };

  const useCase = new UpdateOrganizationUseCase(mockOrganizationRepository);

  const now = new Date();
  const existingOrg = new Organization(
    'org-id',
    'Test Org',
    'user-id',
    now,
    now,
    '123 Main St',
    '+1234567890',
    'test@org.com',
    'https://example.com/logo.png',
    true,
    'UTC',
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update name, logoUrl and timezone', async () => {
    findById.mockResolvedValue(existingOrg);
    update.mockResolvedValue(undefined);

    const result = await useCase.execute(
      'org-id',
      'New Name',
      'https://example.com/new-logo.png',
      'America/New_York',
    );

    expect(result.name).toBe('New Name');
    expect(result.logoUrl).toBe('https://example.com/new-logo.png');
    expect(result.timezone).toBe('America/New_York');
    expect(result.id).toBe('org-id');
    expect(result.ownerId).toBe('user-id');
    expect(update).toHaveBeenCalledWith(result);
  });

  it('should preserve existing fields when only name is updated', async () => {
    findById.mockResolvedValue(existingOrg);
    update.mockResolvedValue(undefined);

    const result = await useCase.execute('org-id', 'Updated Name');

    expect(result.name).toBe('Updated Name');
    expect(result.logoUrl).toBe(existingOrg.logoUrl);
    expect(result.timezone).toBe(existingOrg.timezone);
    expect(update).toHaveBeenCalledWith(result);
  });

  it('should preserve existing fields when only logoUrl is updated', async () => {
    findById.mockResolvedValue(existingOrg);
    update.mockResolvedValue(undefined);

    const result = await useCase.execute(
      'org-id',
      undefined,
      'https://example.com/updated-logo.png',
    );

    expect(result.name).toBe(existingOrg.name);
    expect(result.logoUrl).toBe('https://example.com/updated-logo.png');
    expect(result.timezone).toBe(existingOrg.timezone);
    expect(update).toHaveBeenCalledWith(result);
  });

  it('should preserve existing fields when only timezone is updated', async () => {
    findById.mockResolvedValue(existingOrg);
    update.mockResolvedValue(undefined);

    const result = await useCase.execute(
      'org-id',
      undefined,
      undefined,
      'Europe/London',
    );

    expect(result.name).toBe(existingOrg.name);
    expect(result.logoUrl).toBe(existingOrg.logoUrl);
    expect(result.timezone).toBe('Europe/London');
    expect(update).toHaveBeenCalledWith(result);
  });

  it('should throw OrganizationIdRequiredError when organizationId is null', async () => {
    await expect(useCase.execute(null)).rejects.toThrow(
      OrganizationIdRequiredError,
    );
    expect(findById).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError when organization is not found', async () => {
    findById.mockResolvedValue(null);

    await expect(useCase.execute('nonexistent-id')).rejects.toThrow(
      NotFoundError,
    );
    expect(findById).toHaveBeenCalledWith('nonexistent-id');
    expect(update).not.toHaveBeenCalled();
  });
});
