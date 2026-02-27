import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateMeDto {
  @ApiProperty({
    description: 'First name of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Last name of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Email of the user',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Locale of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  locale?: string;

  @ApiProperty({
    description: 'Avatar URL of the user',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiProperty({
    description: 'Phone number of the user',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;
}
