import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CreateTimeEntryUseCase } from '../application/create-time-entry.usecase';
import { GetTimeEntriesByProjectUseCase } from '../application/get-time-entries-by-project.usecase';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  CurrentUser,
  type JwtUser,
} from '../../../common/decorators/current-user.decorator';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { TimeEntryPresentationMapper } from './time-entry.mapper';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('time-entries')
export class TimeEntryController {
  constructor(
    private readonly createTimeEntryUseCase: CreateTimeEntryUseCase,
    private readonly getTimeEntriesByProjectUseCase: GetTimeEntriesByProjectUseCase,
  ) {}

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

  @ApiResponse({
    status: 200,
    description: 'The list of time entries has been successfully retrieved.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Please provide a valid JWT token.',
  })
  @Get()
  async getByProject(
    @CurrentUser() user: JwtUser,
    @Query('projectId') projectId: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    const timeEntries = await this.getTimeEntriesByProjectUseCase.execute(
      user.id,
      projectId,
      fromDate ? new Date(fromDate) : undefined,
      toDate ? new Date(toDate) : undefined,
    );

    return TimeEntryPresentationMapper.toResponseList(timeEntries);
  }
}
