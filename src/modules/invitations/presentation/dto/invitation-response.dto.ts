import { ApiProperty } from '@nestjs/swagger';

export class InvitationResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  organizationId!: string;

  @ApiProperty({ enum: ['OWNER', 'MANAGER', 'MEMBER'], example: 'MEMBER' })
  role!: string;

  @ApiProperty({ example: 'abc123-token' })
  token?: string;

  @ApiProperty({ example: '2026-03-05T00:00:00.000Z' })
  expiresAt!: Date;

  @ApiProperty({ example: 'colleague@example.com', required: false })
  invitedEmail?: string;

  @ApiProperty({ example: 'https://app.timera.com/invite/abc123-token' })
  inviteUrl?: string;
}
