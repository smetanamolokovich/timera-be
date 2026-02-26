import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { OrganizationRoleEnum } from '../../../memberships/domain/membership';

export class CreateInvitationDto {
  @ApiProperty({
    enum: OrganizationRoleEnum,
    example: OrganizationRoleEnum.MEMBER,
  })
  @IsEnum(OrganizationRoleEnum)
  role!: OrganizationRoleEnum;

  @ApiProperty({ example: 'colleague@example.com', required: false })
  @IsOptional()
  @IsEmail()
  invitedEmail?: string;

  @ApiProperty({
    example: 7,
    required: false,
    description: 'Days until expiry (default: 7, max: 30)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  expiresInDays?: number;
}
