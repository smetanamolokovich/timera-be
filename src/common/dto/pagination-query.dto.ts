import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum SortOrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationQueryDto {
  @ApiPropertyOptional({ example: 1, minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    example: 'uuid-of-last-item',
    description: 'Cursor for cursor-based pagination (ID of last item)',
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({ enum: SortOrderEnum, default: SortOrderEnum.DESC })
  @IsOptional()
  @IsEnum(SortOrderEnum)
  sortOrder?: SortOrderEnum = SortOrderEnum.DESC;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  sortBy?: string;
}
