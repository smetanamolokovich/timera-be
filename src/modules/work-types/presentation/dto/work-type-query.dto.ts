import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto';

export enum WorkTypeSortByEnum {
  name = 'name',
  createdAt = 'createdAt',
}

export class WorkTypeQueryDto extends PaginationQueryDto {
  @ApiProperty({ description: 'Project ID (UUID)', type: String })
  @IsUUID()
  projectId!: string;

  @ApiPropertyOptional({
    enum: WorkTypeSortByEnum,
    default: WorkTypeSortByEnum.createdAt,
  })
  @IsOptional()
  @IsEnum(WorkTypeSortByEnum)
  sortBy?: WorkTypeSortByEnum = WorkTypeSortByEnum.createdAt;
}
