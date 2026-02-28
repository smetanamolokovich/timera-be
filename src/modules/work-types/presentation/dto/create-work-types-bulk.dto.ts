import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  IsUUID,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';

export class CreateWorkTypesBulkDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the project to which the work types belong',
  })
  @IsUUID()
  projectId!: string;

  @ApiProperty({
    example: ['Development', 'Design', 'QA'],
    description: 'List of work type names to create',
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsString({ each: true })
  names!: string[];
}
