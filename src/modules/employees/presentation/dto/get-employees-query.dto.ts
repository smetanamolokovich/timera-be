import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto';

export enum EmployeeSortByEnum {
  name = 'name',
  hourlyRate = 'hourlyRate',
  createdAt = 'createdAt',
}

export class GetEmployeesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: EmployeeSortByEnum,
    default: EmployeeSortByEnum.createdAt,
  })
  @IsOptional()
  @IsEnum(EmployeeSortByEnum)
  sortBy?: EmployeeSortByEnum = EmployeeSortByEnum.createdAt;
}
