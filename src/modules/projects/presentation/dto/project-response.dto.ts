import { ApiProperty } from '@nestjs/swagger';

export class ProjectResponseDto {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Project Alpha' })
  name!: string;

  @ApiProperty({ example: '2026-02-15T12:00:00Z' })
  createdAt!: Date;
}
