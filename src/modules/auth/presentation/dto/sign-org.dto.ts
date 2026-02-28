import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SwitchOrgDto {
  @ApiProperty({
    example: 'e55d7326-8d85-48d9-830b-c27f1b0ee42d',
    description: 'The organization ID to switch to',
  })
  @IsUUID()
  organizationId!: string;
}
