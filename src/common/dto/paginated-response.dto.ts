import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ example: 100 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  limit!: number;

  @ApiProperty({ example: 'uuid-of-last-item', nullable: true })
  nextCursor!: string | null;

  @ApiProperty({ example: true })
  hasNextPage!: boolean;
}

export class PaginatedResponseDto<T> {
  data!: T[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta!: PaginationMetaDto;
}
