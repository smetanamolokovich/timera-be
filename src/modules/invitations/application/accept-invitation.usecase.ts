import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import type { InvitationRepository } from '../domain/interfaces/invitation.repository';
import type { MembershipRepository } from '../../memberships/domain/interfaces/membership.repository.interface';
import { Membership } from '../../memberships/domain/membership';
import { InvalidInvitationTokenError } from '../domain/errors/invalid-invitation-token.error';
import type { EmployeeRepository } from '../../employees/domain/employee.repository';
import type { UserRepository } from '../../users/domain/user.repository';
import { Employee } from '../../employees/domain/employee';

@Injectable()
export class AcceptInvitationUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.InvitationRepository)
    private readonly invitationRepository: InvitationRepository,
    @Inject(REPOSITORY_TOKENS.MembershipRepository)
    private readonly membershipRepository: MembershipRepository,
    @Inject(REPOSITORY_TOKENS.EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,
    @Inject(REPOSITORY_TOKENS.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string, token: string) {
    const invitation = await this.invitationRepository.findByToken(token);

    if (!invitation) {
      throw new InvalidInvitationTokenError();
    }

    if (invitation.isExpired()) {
      throw new InvalidInvitationTokenError();
    }

    if (invitation.isUsed()) {
      throw new InvalidInvitationTokenError();
    }

    const membership = new Membership(
      crypto.randomUUID(),
      userId,
      invitation.organizationId,
      invitation.role,
      new Date(),
    );

    await this.membershipRepository.save(membership);
    await this.invitationRepository.markAsUsed(invitation.id, new Date());

    const existing = await this.employeeRepository.findByUserIdAndOrganizationId(
      userId,
      invitation.organizationId,
    );

    if (!existing) {
      const user = await this.userRepository.findById(userId);
      const fullName = user
        ? `${user.firstName} ${user.lastName}`.trim()
        : '';
      const name = fullName.length >= 2 ? fullName : userId;

      const employee = new Employee(
        crypto.randomUUID(),
        invitation.organizationId,
        userId,
        name,
        null,
        new Date(),
      );

      await this.employeeRepository.save(employee);
    }

    return membership;
  }
}
