import { Invitation } from '../invitation';

export interface InvitationRepository {
  save(invitation: Invitation): Promise<void>;
  findByToken(token: string): Promise<Invitation | null>;
  findById(id: string): Promise<Invitation | null>;
  markAsUsed(id: string, usedAt: Date): Promise<void>;
}
