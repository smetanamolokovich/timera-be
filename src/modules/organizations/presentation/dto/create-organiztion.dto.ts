import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsString, IsUrl } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({
    example: 'Acme Corporation',
    description: 'The name of the organization',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: '123 Main St, Anytown, USA',
    description: 'The address of the organization',
    required: false,
  })
  @IsString()
  address?: string;

  @ApiProperty({
    example: '+1 (555) 123-4567',
    description: 'The phone number of the organization',
    required: false,
  })
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    example: 'info@acme.com',
    description: 'The email address of the organization',
    required: false,
  })
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'https://example.com/logo.png',
    description: 'The URL of the organization logo',
    required: false,
  })
  @IsUrl()
  logoUrl?: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the organization is active',
    required: false,
  })
  @IsBoolean()
  isActive?: boolean = true;
}
