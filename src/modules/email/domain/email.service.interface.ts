export interface EmailService {
  sendInvitation(to: string, inviteUrl: string, role: string): Promise<void>;
}
