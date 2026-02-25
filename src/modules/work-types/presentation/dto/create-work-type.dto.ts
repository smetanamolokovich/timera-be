import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateWorkTypeDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the project to which the work type belongs',
  })
  @IsUUID()
  projectId!: string;

  @ApiProperty({
    example: 'Development',
    description: 'The name of the work type',
  })
  @IsString()
  name!: string;
}
