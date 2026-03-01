import { DeleteProjectUseCase } from './delete-project.usecase';
import { ProjectNotFoundError } from '../domain/errors/project-not-found.error';
import { OrganizationAccessDeniedError } from '../domain/errors/organization-access-denied.error';
import { Project } from '../domain/project';
import type { ProjectRepository } from '../domain/project.repository';

describe('DeleteProjectUseCase', () => {
  const save = jest.fn<Promise<void>, [Project]>();
  const findById = jest.fn<Promise<Project | null>, [string]>();
  const findByOrganizationId = jest.fn();
  const deleteFn = jest.fn<Promise<void>, [string]>();

  const mockProjectRepository: ProjectRepository = {
    save,
    findById,
    findByOrganizationId,
    delete: deleteFn,
  };

  const useCase = new DeleteProjectUseCase(mockProjectRepository);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete the project when it exists and belongs to the organization', async () => {
    const project = new Project(
      'project-id',
      'org-id',
      'Test Project',
      new Date(),
    );
    findById.mockResolvedValue(project);
    deleteFn.mockResolvedValue(undefined);

    await useCase.execute('project-id', 'org-id');

    expect(findById).toHaveBeenCalledWith('project-id');
    expect(deleteFn).toHaveBeenCalledWith('project-id');
  });

  it('should throw ProjectNotFoundError when the project does not exist', async () => {
    findById.mockResolvedValue(null);

    await expect(useCase.execute('nonexistent-id', 'org-id')).rejects.toThrow(
      ProjectNotFoundError,
    );
    expect(deleteFn).not.toHaveBeenCalled();
  });

  it('should throw OrganizationAccessDeniedError when the project belongs to a different organization', async () => {
    const project = new Project(
      'project-id',
      'other-org-id',
      'Test Project',
      new Date(),
    );
    findById.mockResolvedValue(project);

    await expect(
      useCase.execute('project-id', 'org-id'),
    ).rejects.toThrow(OrganizationAccessDeniedError);
    expect(deleteFn).not.toHaveBeenCalled();
  });
});
