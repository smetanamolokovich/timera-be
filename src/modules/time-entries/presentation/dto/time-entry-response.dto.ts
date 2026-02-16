import { ApiResponseProperty } from '@nestjs/swagger';

export class TimeEntryResponseDto {
  @ApiResponseProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiResponseProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  projectId!: string;

  @ApiResponseProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  employeeId!: string;

  @ApiResponseProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  workTypeId!: string;

  @ApiResponseProperty({
    type: String,
    example: 'Worked on feature X',
  })
  description!: string;

  @ApiResponseProperty({
    type: Number,
    example: 8,
  })
  hours!: number;

  @ApiResponseProperty({
    type: String,
    example: '2023-01-01T00:00:00.000Z',
  })
  date!: Date;

  @ApiResponseProperty({
    type: String,
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt!: Date;
}
