import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'a1b2c3d4e5f6...',
    description: 'The password reset token received via email',
  })
  @IsString()
  token!: string;

  @ApiProperty({
    example: 'newPassword123',
    description: 'The new password (minimum 8 characters)',
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
