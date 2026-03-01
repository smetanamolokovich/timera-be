import { GetProjectByIdUseCase } from './get-project-by-id.usecase';
import { ProjectNotFoundError } from '../domain/errors/project-not-found.error';
import { Project } from '../domain/project';
import type { ProjectRepository } from '../domain/project.repository';

describe('GetProjectByIdUseCase', () => {
  const save = jest.fn<Promise<void>, [Project]>();
  const findById = jest.fn<Promise<Project | null>, [string]>();
  const findByOrganizationId = jest.fn();
  const mockProjectRepository: ProjectRepository = {
    save,
    findById,
    findByOrganizationId,
  };

  const useCase = new GetProjectByIdUseCase(mockProjectRepository);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the project when found', async () => {
    const now = new Date();
    const project = new Project('project-id', 'org-id', 'Test Project', now);
    findById.mockResolvedValue(project);

    const result = await useCase.execute('project-id');

    expect(result).toBe(project);
    expect(findById).toHaveBeenCalledWith('project-id');
  });

  it('should throw ProjectNotFoundError when project is not found', async () => {
    findById.mockResolvedValue(null);

    await expect(useCase.execute('nonexistent-id')).rejects.toThrow(
      ProjectNotFoundError,
    );
    expect(findById).toHaveBeenCalledWith('nonexistent-id');
  });
});
