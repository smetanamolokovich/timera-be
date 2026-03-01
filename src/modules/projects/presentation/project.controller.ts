import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateProjectUseCase } from '../application/create-project.usecase';
import { UpdateProjectUseCase } from '../application/update-project.usecase';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  CurrentUser,
  type JwtUser,
} from '../../../common/decorators/current-user.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ProjectPresentationMapper } from './project.mapper';
import { ProjectResponseDto } from './dto/project-response.dto';
import { OrganizationIdRequiredError } from '../../../common/errors/organization-id-required.error';
import { GetProjectsUseCase } from '../application/get-projects.usecase';
import { Roles } from '../../../common/decorators/roles.decorator';
import { OrganizationRoleEnum } from '../../memberships/domain/membership';
import { RolesGuard } from '../../../common/guards/roles.guard';
import {
  GetProjectsQueryDto,
  ProjectSortByEnum,
} from './dto/get-projects-query.dto';
import { SortOrderEnum } from '../../../common/dto/pagination-query.dto';
import { PaginationMetaDto } from '../../../common/dto/paginated-response.dto';

@ApiTags('Projects')
@ApiExtraModels(PaginationMetaDto, ProjectResponseDto)
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly getProjectsUseCase: GetProjectsUseCase,
    private readonly updateProjectUseCase: UpdateProjectUseCase,
  ) {}

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
  @ApiForbiddenResponse({
    description: 'Forbidden. Required role: OWNER or MANAGER.',
  })
  @Roles(OrganizationRoleEnum.OWNER, OrganizationRoleEnum.MANAGER)
  @UseGuards(RolesGuard)
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

  @ApiOperation({ summary: 'List projects in the organization' })
  @ApiResponse({
    status: 200,
    description: 'The list of projects has been successfully retrieved.',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(ProjectResponseDto) },
        },
        meta: { $ref: getSchemaPath(PaginationMetaDto) },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Please provide a valid JWT token.',
  })
  @ApiQuery({ name: 'sortBy', required: false, enum: ProjectSortByEnum })
  @ApiQuery({ name: 'sortOrder', required: false, enum: SortOrderEnum })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @Get()
  async getProjects(
    @CurrentUser() user: JwtUser,
    @Query() query: GetProjectsQueryDto,
  ) {
    if (!user.organizationId) throw new OrganizationIdRequiredError();

    const result = await this.getProjectsUseCase.execute(
      user.organizationId,
      query,
    );

    return {
      ...result,
      data: result.data.map((project) =>
        ProjectPresentationMapper.toResponse(project),
      ),
    };
  }

  @ApiOperation({ summary: 'Update a project by ID' })
  @ApiResponse({
    status: 200,
    description: 'The project has been successfully updated.',
    type: ProjectResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Please provide a valid JWT token.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden. Required role: OWNER or MANAGER.',
  })
  @ApiNotFoundResponse({ description: 'Project not found.' })
  @Roles(OrganizationRoleEnum.OWNER, OrganizationRoleEnum.MANAGER)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async updateProject(
    @CurrentUser() user: JwtUser,
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    if (!user.organizationId) throw new OrganizationIdRequiredError();

    const project = await this.updateProjectUseCase.execute(
      user.organizationId,
      id,
      dto,
    );

    return ProjectPresentationMapper.toResponse(project);
  }
}
