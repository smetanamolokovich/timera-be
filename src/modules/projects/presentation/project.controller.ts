import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateProjectUseCase } from '../application/create-project.usecase';
import { GetProjectByUserIdUseCase } from '../application/get-project-by-user-id.usecase';
import { CreateProjectDto } from './dto/create-project.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  CurrentUser,
  type JwtUser,
} from '../../../common/decorators/current-user.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('projects')
export class ProjectController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly getProjectByUserIdUseCase: GetProjectByUserIdUseCase,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({
    status: 201,
    description: 'The project has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Please provide a valid JWT token.',
  })
  @ApiInternalServerErrorResponse({
    description: 'An unexpected error occurred.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createProject(
    @CurrentUser() user: JwtUser,
    @Body() dto: CreateProjectDto,
  ) {
    return this.createProjectUseCase.execute(user.id, dto.name);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get projects by user ID' })
  @ApiResponse({
    status: 200,
    description: 'The projects have been successfully retrieved.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Please provide a valid JWT token.',
  })
  @ApiInternalServerErrorResponse({
    description: 'An unexpected error occurred.',
  })
  @Get()
  async getProjectsByUserId(@CurrentUser() user: JwtUser) {
    return this.getProjectByUserIdUseCase.execute(user.id);
  }
}
