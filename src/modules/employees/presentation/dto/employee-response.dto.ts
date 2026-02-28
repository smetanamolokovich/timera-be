import { ApiProperty } from '@nestjs/swagger';

export class EmployeeResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  organizationId!: string;

  @ApiProperty({ example: 'Jane Smith' })
  name!: string;

  @ApiProperty({ example: 50.0, nullable: true })
  hourlyRate!: number | null;

  @ApiProperty({ example: '2026-02-15T12:00:00.000Z' })
  createdAt!: Date;
}
