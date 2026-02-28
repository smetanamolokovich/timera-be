import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto';

export enum TimeEntrySortByEnum {
  date = 'date',
  hours = 'hours',
  createdAt = 'createdAt',
}

export class GetTimeEntriesQueryDto extends PaginationQueryDto {
  @ApiProperty({ description: 'Project ID (UUID)', type: String })
  @IsUUID()
  projectId!: string;

  @ApiPropertyOptional({ example: '2026-01-01', type: String })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({ example: '2026-01-31', type: String })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiPropertyOptional({
    enum: TimeEntrySortByEnum,
    default: TimeEntrySortByEnum.date,
  })
  @IsOptional()
  @IsEnum(TimeEntrySortByEnum)
  sortBy?: TimeEntrySortByEnum = TimeEntrySortByEnum.date;
}
