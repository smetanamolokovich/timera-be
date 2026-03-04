import { GetWorkTypeByIdUseCase } from './get-work-type-by-id.usecase';
import { WorkTypeNotFoundError } from '../domain/errors/work-type-not-found.error';
import { WorkType } from '../domain/work-type';
import type { WorkTypeRepository } from '../domain/work-type.repository';

describe('GetWorkTypeByIdUseCase', () => {
  const save = jest.fn<Promise<void>, [WorkType]>();
  const findById = jest.fn<Promise<WorkType | null>, [string]>();
  const findByIdAndProjectId = jest.fn<
    Promise<WorkType | null>,
    [string, string]
  >();
  const findByProjectId = jest.fn();
  const mockWorkTypeRepository: WorkTypeRepository = {
    save,
    findById,
    findByIdAndProjectId,
    findByProjectId,
  };

  const useCase = new GetWorkTypeByIdUseCase(mockWorkTypeRepository);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the work type when found', async () => {
    const workType = new WorkType(
      'wt-id',
      'project-id',
      'Development',
      new Date(),
    );
    findById.mockResolvedValue(workType);

    const result = await useCase.execute('wt-id');

    expect(result).toBe(workType);
    expect(findById).toHaveBeenCalledWith('wt-id');
  });

  it('should throw WorkTypeNotFoundError when work type is not found', async () => {
    findById.mockResolvedValue(null);

    await expect(useCase.execute('nonexistent-id')).rejects.toThrow(
      WorkTypeNotFoundError,
    );
    expect(findById).toHaveBeenCalledWith('nonexistent-id');
  });
});
