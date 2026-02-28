import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto';

export enum ProjectSortByEnum {
  name = 'name',
  createdAt = 'createdAt',
}

export class GetProjectsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: ProjectSortByEnum,
    default: ProjectSortByEnum.createdAt,
  })
  @IsOptional()
  @IsEnum(ProjectSortByEnum)
  sortBy?: ProjectSortByEnum = ProjectSortByEnum.createdAt;
}
