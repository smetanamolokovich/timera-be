import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetWorkTypesUseCase } from '../application/get-work-types.usecase';
import { CreateWorkTypeUseCase } from '../application/create-work-type.usecase';
import { CreateWorkTypesBulkUseCase } from '../application/create-work-types-bulk.usecase';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { WorkTypePresentationMapper } from './work-type.mapper';
import { CreateWorkTypeDto } from './dto/create-work-type.dto';
import { CreateWorkTypesBulkDto } from './dto/create-work-types-bulk.dto';
import {
  CurrentUser,
  type JwtUser,
} from '../../../common/decorators/current-user.decorator';
import { OrganizationIdRequiredError } from '../../../common/errors/organization-id-required.error';
import { Roles } from '../../../common/decorators/roles.decorator';
import { OrganizationRoleEnum } from '../../memberships/domain/membership';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

@ApiTags('Work Types')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('work-types')
export class WorkTypeController {
  constructor(
    private readonly createWorkTypeUseCase: CreateWorkTypeUseCase,
    private readonly createWorkTypesBulkUseCase: CreateWorkTypesBulkUseCase,
    private readonly getWorkTypesUseCase: GetWorkTypesUseCase,
  ) {}

  @ApiOperation({ summary: 'List work types for a project' })
  @ApiResponse({
    status: 200,
    description: 'The list of work types has been successfully retrieved.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Please provide a valid JWT token.',
  })
  @ApiParam({ name: 'projectId', type: String, description: 'Project ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @Get(':projectId')
  async getWorkTypes(
    @Param('projectId') projectId: string,
    @Query() pagination: PaginationQueryDto,
  ) {
    const result = await this.getWorkTypesUseCase.execute(projectId, pagination);

    const { data, ...paginationMeta } = result;

    return {
      ...paginationMeta,
      data: data.map((workType) => WorkTypePresentationMapper.toResponse(workType)),
    };
  }

  @ApiOperation({ summary: 'Create a work type' })
  @ApiCreatedResponse({
    description: 'The work type has been successfully created.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Please provide a valid JWT token.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request. Please check the input data.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden. Required role: OWNER or MANAGER.',
  })
  @Roles(OrganizationRoleEnum.OWNER, OrganizationRoleEnum.MANAGER)
  @UseGuards(RolesGuard)
  @Post()
  async createWorkType(
    @CurrentUser() user: JwtUser,
    @Body() dto: CreateWorkTypeDto,
  ) {
    if (!user.organizationId) throw new OrganizationIdRequiredError();

    const workType = await this.createWorkTypeUseCase.execute(
      user.organizationId,
      dto.projectId,
      dto.name,
    );

    return WorkTypePresentationMapper.toResponse(workType);
  }

  @ApiOperation({ summary: 'Bulk create work types' })
  @ApiCreatedResponse({
    description: 'Work types have been successfully created.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Please provide a valid JWT token.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request. Please check the input data.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden. Required role: OWNER or MANAGER.',
  })
  @Roles(OrganizationRoleEnum.OWNER, OrganizationRoleEnum.MANAGER)
  @UseGuards(RolesGuard)
  @Post('bulk')
  async createWorkTypesBulk(
    @CurrentUser() user: JwtUser,
    @Body() dto: CreateWorkTypesBulkDto,
  ) {
    if (!user.organizationId) throw new OrganizationIdRequiredError();

    const workTypes = await this.createWorkTypesBulkUseCase.execute(
      user.organizationId,
      dto.projectId,
      dto.names,
    );

    return WorkTypePresentationMapper.toResponseList(workTypes);
  }
}
