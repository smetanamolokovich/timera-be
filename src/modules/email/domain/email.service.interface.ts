export interface EmailService {
  sendInvitation(to: string, inviteUrl: string, role: string): Promise<void>;
  sendPasswordReset(to: string, resetUrl: string): Promise<void>;
}
