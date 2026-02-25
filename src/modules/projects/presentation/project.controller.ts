import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateProjectUseCase } from '../application/create-project.usecase';
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
import { ProjectPresentationMapper } from './project.mapper';
import { OrganizationIdRequiredError } from '../../../common/errors/organization-id-required.error';
import { GetProjectsUseCase } from '../application/get-projects.usecase';

@UseGuards(AuthGuard('jwt'))
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly getProjectsUseCase: GetProjectsUseCase,
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
  @Post()
  async createProject(
    @CurrentUser() user: JwtUser,
    @Body() dto: CreateProjectDto,
  ) {
    if (!user.organizationId) throw new OrganizationIdRequiredError();

    const project = await this.createProjectUseCase.execute(
      user.organizationId,
      dto.name,
    );

    return ProjectPresentationMapper.toResponse(project);
  }

  @ApiResponse({
    status: 200,
    description: 'The list of projects has been successfully retrieved.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Please provide a valid JWT token.',
  })
  @Get()
  async getProjects(@CurrentUser() user: JwtUser) {
    if (!user.organizationId) throw new OrganizationIdRequiredError();

    const projects = await this.getProjectsUseCase.execute(user.organizationId);

    return ProjectPresentationMapper.toResponseList(projects);
  }
}
