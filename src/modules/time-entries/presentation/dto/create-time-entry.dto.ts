import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateTimeEntryDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the project to which the time entry belongs',
  })
  @IsUUID()
  projectId!: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the work type associated with the time entry',
  })
  @IsUUID()
  workTypeId!: string;

  @ApiProperty({
    example: '2023-01-01',
    description: 'The date of the time entry',
  })
  @IsDateString()
  date!: string;

  @ApiProperty({
    example: 8,
    description: 'The number of hours worked',
  })
  @IsNumber()
  hours!: number;

  @ApiProperty({
    example: 'Worked on feature X',
    description: 'A description of the work done',
  })
  @IsString()
  description!: string;
}
