import { GetCurrentOrganizationUseCase } from './get-current-organization.usecase';
import { NotFoundError } from '../../../common/errors/not-found.errors';
import { OrganizationIdRequiredError } from '../../../common/errors/organization-id-required.error';
import { Organization } from '../domain/organization';
import type { OrganizationRepository } from '../domain/interfaces/organization.interface';

describe('GetCurrentOrganizationUseCase', () => {
  const save = jest.fn<Promise<void>, [Organization]>();
  const findById = jest.fn<Promise<Organization | null>, [string]>();
  const mockOrganizationRepository: OrganizationRepository = { save, findById };

  const useCase = new GetCurrentOrganizationUseCase(mockOrganizationRepository);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the organization when found', async () => {
    const now = new Date();
    const org = new Organization('org-id', 'Test Org', 'user-id', now, now);
    findById.mockResolvedValue(org);

    const result = await useCase.execute('org-id');

    expect(result).toBe(org);
    expect(findById).toHaveBeenCalledWith('org-id');
  });

  it('should throw OrganizationIdRequiredError when organizationId is null', async () => {
    await expect(useCase.execute(null)).rejects.toThrow(
      OrganizationIdRequiredError,
    );
    expect(findById).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError when organization is not found', async () => {
    findById.mockResolvedValue(null);

    await expect(useCase.execute('nonexistent-id')).rejects.toThrow(
      NotFoundError,
    );
    expect(findById).toHaveBeenCalledWith('nonexistent-id');
  });
});
