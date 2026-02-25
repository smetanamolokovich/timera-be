import { Membership } from '../membership';

export interface MembershipRepository {
  save(membership: Membership): Promise<void>;
  findByUserId(userId: string): Promise<Membership[]>;
  findByUserAndOrganization(
    userId: string,
    organizationId: string,
  ): Promise<Membership | null>;
}
