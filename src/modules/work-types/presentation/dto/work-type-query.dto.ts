import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto';

export class WorkTypeQueryDto extends PaginationQueryDto {
  @ApiProperty({ description: 'Project ID (UUID)', type: String })
  @IsUUID()
  projectId!: string;
}
