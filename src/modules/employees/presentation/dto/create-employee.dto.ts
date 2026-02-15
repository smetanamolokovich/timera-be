import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the employee',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    example: 25,
    description: 'The hourly rate of the employee',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  hourlyRate?: number;
}
