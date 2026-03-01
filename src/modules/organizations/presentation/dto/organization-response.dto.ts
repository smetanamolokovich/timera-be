import { ApiProperty } from '@nestjs/swagger';

export class OrganizationResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique identifier of the organization',
  })
  id!: string;

  @ApiProperty({ example: 'Acme Corp', description: 'Organization name' })
  name!: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the owner',
  })
  ownerId!: string;

  @ApiProperty({
    example: '123 Main St',
    description: 'Organization address',
    required: false,
  })
  address?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Organization phone number',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    example: 'contact@acme.com',
    description: 'Organization email',
    required: false,
  })
  email?: string;

  @ApiProperty({
    example: 'https://example.com/logo.png',
    description: 'Organization logo URL',
    required: false,
  })
  logoUrl?: string;

  @ApiProperty({
    example: 'America/New_York',
    description: 'Organization timezone',
    required: false,
  })
  timezone?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the organization is active',
  })
  isActive!: boolean;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'The date and time when the organization was created',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'The date and time when the organization was last updated',
  })
  updatedAt!: Date;
}
