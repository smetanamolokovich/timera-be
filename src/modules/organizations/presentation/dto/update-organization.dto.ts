import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { IsIANATimezone } from '../../../../common/decorators/is-iana-timezone.decorator';

export class UpdateOrganizationDto {
  @ApiProperty({
    example: 'Acme Corporation',
    description: 'The name of the organization',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @ApiProperty({
    example: 'https://example.com/logo.png',
    description: 'The URL of the organization logo',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiProperty({
    example: 'America/New_York',
    description: 'The timezone of the organization (IANA format)',
    required: false,
  })
  @IsOptional()
  @IsIANATimezone()
  timezone?: string;
}
