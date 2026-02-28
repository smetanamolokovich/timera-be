import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CreateTimeEntryUseCase } from '../application/create-time-entry.usecase';
import { GetTimeEntriesByProjectUseCase } from '../application/get-time-entries-by-project.usecase';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  CurrentUser,
  type JwtUser,
} from '../../../common/decorators/current-user.decorator';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { TimeEntryPresentationMapper } from './time-entry.mapper';
import { TimeEntryResponseDto } from './dto/time-entry-response.dto';
import { GetTimeEntriesQueryDto } from './dto/get-time-entries-query.dto';
import { PaginationMetaDto } from '../../../common/dto/paginated-response.dto';

@ApiTags('Time Entries')
@ApiExtraModels(PaginationMetaDto, TimeEntryResponseDto)
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('time-entries')
export class TimeEntryController {
  constructor(
    private readonly createTimeEntryUseCase: CreateTimeEntryUseCase,
    private readonly getTimeEntriesByProjectUseCase: GetTimeEntriesByProjectUseCase,
  ) {}

  @ApiOperation({ summary: 'Log a new time entry' })
  @ApiResponse({
    status: 201,
    description: 'The time entry has been successfully created.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Please provide a valid JWT token.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request. Please check the input data.',
  })
  @Post()
  async create(@CurrentUser() user: JwtUser, @Body() dto: CreateTimeEntryDto) {
    const timeEntry = await this.createTimeEntryUseCase.execute(
      user.id,
      dto.projectId,
      dto.workTypeId,
      dto.description,
      dto.hours,
      dto.date ? new Date(dto.date) : new Date(),
    );

    return TimeEntryPresentationMapper.toResponse(timeEntry);
  }

  @ApiOperation({ summary: 'List time entries for a project' })
  @ApiResponse({
    status: 200,
    description: 'The list of time entries has been successfully retrieved.',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(TimeEntryResponseDto) },
        },
        meta: { $ref: getSchemaPath(PaginationMetaDto) },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Please provide a valid JWT token.',
  })
  @ApiQuery({
    name: 'projectId',
    required: true,
    type: String,
    description: 'Project ID',
  })
  @ApiQuery({
    name: 'fromDate',
    required: false,
    type: String,
    example: '2026-01-01',
  })
  @ApiQuery({
    name: 'toDate',
    required: false,
    type: String,
    example: '2026-01-31',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @Get()
  async getByProject(
    @CurrentUser() user: JwtUser,
    @Query() query: GetTimeEntriesQueryDto,
  ) {
    const result = await this.getTimeEntriesByProjectUseCase.execute(
      user.id,
      query.projectId,
      query,
      query.fromDate ? new Date(query.fromDate) : undefined,
      query.toDate ? new Date(query.toDate) : undefined,
    );

    return {
      ...result,
      data: result.data.map((timeEntry) =>
        TimeEntryPresentationMapper.toResponse(timeEntry),
      ),
    };
  }
}
