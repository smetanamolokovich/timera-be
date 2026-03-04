import { AcceptInvitationUseCase } from './accept-invitation.usecase';
import { InvalidInvitationTokenError } from '../domain/errors/invalid-invitation-token.error';
import { Invitation } from '../domain/invitation';
import { Membership, OrganizationRoleEnum } from '../../memberships/domain/membership';
import { Employee } from '../../employees/domain/employee';
import { User } from '../../users/domain/user';
import type { InvitationRepository } from '../domain/interfaces/invitation.repository';
import type { MembershipRepository } from '../../memberships/domain/interfaces/membership.repository.interface';
import type { EmployeeRepository } from '../../employees/domain/employee.repository';
import type { UserRepository } from '../../users/domain/user.repository';

describe('AcceptInvitationUseCase', () => {
  const findByToken = jest.fn<Promise<Invitation | null>, [string]>();
  const saveInvitation = jest.fn<Promise<void>, [Invitation]>();
  const findInvitationById = jest.fn<Promise<Invitation | null>, [string]>();
  const markAsUsed = jest.fn<Promise<void>, [string, Date]>();
  const mockInvitationRepository: InvitationRepository = {
    findByToken,
    save: saveInvitation,
    findById: findInvitationById,
    markAsUsed,
  };

  const saveMembership = jest.fn<Promise<void>, [Membership]>();
  const findMembershipByUserId = jest.fn<Promise<Membership[]>, [string]>();
  const findByUserAndOrganization = jest.fn<
    Promise<Membership | null>,
    [string, string]
  >();
  const mockMembershipRepository: MembershipRepository = {
    save: saveMembership,
    findByUserId: findMembershipByUserId,
    findByUserAndOrganization,
  };

  const saveEmployee = jest.fn<Promise<void>, [Employee]>();
  const findEmployeeById = jest.fn<Promise<Employee | null>, [string]>();
  const findByUserId = jest.fn<Promise<Employee | null>, [string]>();
  const findByUserIdAndOrganizationId = jest.fn<
    Promise<Employee | null>,
    [string, string]
  >();
  const findByOrganizationId = jest.fn();
  const mockEmployeeRepository: EmployeeRepository = {
    save: saveEmployee,
    findById: findEmployeeById,
    findByUserId,
    findByUserIdAndOrganizationId,
    findByOrganizationId,
  };

  const findUserById = jest.fn<Promise<User | null>, [string]>();
  const findByEmail = jest.fn<Promise<User | null>, [string]>();
  const saveUser = jest.fn<Promise<void>, [User]>();
  const updateUser = jest.fn<Promise<void>, [User]>();
  const mockUserRepository: UserRepository = {
    findById: findUserById,
    findByEmail,
    save: saveUser,
    update: updateUser,
  };

  const useCase = new AcceptInvitationUseCase(
    mockInvitationRepository,
    mockMembershipRepository,
    mockEmployeeRepository,
    mockUserRepository,
  );

  const validInvitation = new Invitation(
    'inv-id',
    'org-id',
    OrganizationRoleEnum.MEMBER,
    'valid-token',
    new Date(Date.now() + 3_600_000),
    'creator-id',
    new Date(),
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create membership and employee on valid invitation', async () => {
    const user = new User(
      'user-id',
      'john@example.com',
      'hashedpassword',
      new Date(),
      new Date(),
      'John',
      'Doe',
    );
    findByToken.mockResolvedValue(validInvitation);
    saveMembership.mockResolvedValue(undefined);
    markAsUsed.mockResolvedValue(undefined);
    findByUserIdAndOrganizationId.mockResolvedValue(null);
    findUserById.mockResolvedValue(user);
    saveEmployee.mockResolvedValue(undefined);

    const membership = await useCase.execute('user-id', 'valid-token');

    expect(membership).toBeInstanceOf(Membership);
    expect(membership.userId).toBe('user-id');
    expect(membership.organizationId).toBe('org-id');
    expect(saveMembership).toHaveBeenCalledTimes(1);
    expect(markAsUsed).toHaveBeenCalledWith('inv-id', expect.any(Date));
    expect(findByUserIdAndOrganizationId).toHaveBeenCalledWith('user-id', 'org-id');
    expect(saveEmployee).toHaveBeenCalledTimes(1);
    const savedEmployee: Employee = saveEmployee.mock.calls[0][0];
    expect(savedEmployee.userId).toBe('user-id');
    expect(savedEmployee.organizationId).toBe('org-id');
    expect(savedEmployee.name).toBe('John Doe');
    expect(savedEmployee.hourlyRate).toBeNull();
  });

  it('should skip employee creation when employee already exists (idempotent)', async () => {
    const existingEmployee = new Employee(
      'emp-id',
      'org-id',
      'user-id',
      'John Doe',
      null,
      new Date(),
    );
    findByToken.mockResolvedValue(validInvitation);
    saveMembership.mockResolvedValue(undefined);
    markAsUsed.mockResolvedValue(undefined);
    findByUserIdAndOrganizationId.mockResolvedValue(existingEmployee);

    await useCase.execute('user-id', 'valid-token');

    expect(saveEmployee).not.toHaveBeenCalled();
    expect(findUserById).not.toHaveBeenCalled();
  });

  it('should throw InvalidInvitationTokenError when invitation not found', async () => {
    findByToken.mockResolvedValue(null);

    await expect(useCase.execute('user-id', 'bad-token')).rejects.toThrow(
      InvalidInvitationTokenError,
    );
    expect(saveMembership).not.toHaveBeenCalled();
  });

  it('should throw InvalidInvitationTokenError when invitation is expired', async () => {
    const expiredInvitation = new Invitation(
      'inv-id',
      'org-id',
      OrganizationRoleEnum.MEMBER,
      'expired-token',
      new Date(Date.now() - 1000),
      'creator-id',
      new Date(),
    );
    findByToken.mockResolvedValue(expiredInvitation);

    await expect(useCase.execute('user-id', 'expired-token')).rejects.toThrow(
      InvalidInvitationTokenError,
    );
    expect(saveMembership).not.toHaveBeenCalled();
  });

  it('should throw InvalidInvitationTokenError when invitation is already used', async () => {
    const usedInvitation = new Invitation(
      'inv-id',
      'org-id',
      OrganizationRoleEnum.MEMBER,
      'used-token',
      new Date(Date.now() + 3_600_000),
      'creator-id',
      new Date(),
      undefined,
      new Date(),
    );
    findByToken.mockResolvedValue(usedInvitation);

    await expect(useCase.execute('user-id', 'used-token')).rejects.toThrow(
      InvalidInvitationTokenError,
    );
    expect(saveMembership).not.toHaveBeenCalled();
  });

  it('should use userId as name fallback when user is not found', async () => {
    findByToken.mockResolvedValue(validInvitation);
    saveMembership.mockResolvedValue(undefined);
    markAsUsed.mockResolvedValue(undefined);
    findByUserIdAndOrganizationId.mockResolvedValue(null);
    findUserById.mockResolvedValue(null);
    saveEmployee.mockResolvedValue(undefined);

    await useCase.execute('user-id', 'valid-token');

    expect(saveEmployee).toHaveBeenCalledTimes(1);
    const savedEmployee: Employee = saveEmployee.mock.calls[0][0];
    expect(savedEmployee.name).toBe('user-id');
  });
});
