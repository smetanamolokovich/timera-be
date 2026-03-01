import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
  Length,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

function IsIANATimezone(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isIANATimezone',
      target: (object as { constructor: Function }).constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string') return false;
          try {
            Intl.DateTimeFormat(undefined, { timeZone: value });
            return true;
          } catch {
            return false;
          }
        },
        defaultMessage() {
          return `$property must be a valid IANA timezone (e.g. "America/New_York", "UTC")`;
        },
      },
    });
  };
}

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
