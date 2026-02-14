import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    example: 'Project Alpha',
    description: 'The name of the project',
  })
  name!: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique identifier of the user who owns the project',
  })
  userId!: string;
}
