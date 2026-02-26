import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    example: 'Project Alpha',
    description: 'The name of the project',
  })
  @IsString()
  @MaxLength(100)
  name!: string;
}
