import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateTimeEntryDto {
  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the work type associated with the time entry',
  })
  @IsOptional()
  @IsUUID()
  workTypeId?: string;

  @ApiPropertyOptional({
    example: '2023-01-01',
    description: 'The date of the time entry',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    example: 8,
    description: 'The number of hours worked',
  })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Max(24)
  hours?: number;

  @ApiPropertyOptional({
    example: 'Worked on feature X',
    description: 'A description of the work done',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  description?: string;
}
