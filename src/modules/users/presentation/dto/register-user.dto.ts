import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
  })
  @IsString()
  firstName!: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
  })
  @IsString()
  lastName!: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'The URL of the user avatar',
  })
  @IsString()
  avatarUrl?: string;

  @ApiProperty({
    example: 'America/New_York',
    description: 'The timezone of the user',
  })
  @IsString()
  timezone?: string;

  @ApiProperty({
    example: 'en-US',
    description: 'The locale of the user',
  })
  @IsString()
  locale?: string;

  @IsPhoneNumber()
  @ApiProperty({
    example: '+1234567890',
    description: 'The phone number of the user',
  })
  phone?: string;
}
