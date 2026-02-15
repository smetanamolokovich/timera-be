import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    example: 'Project Alpha',
    description: 'The name of the project',
  })
  name!: string;
}
