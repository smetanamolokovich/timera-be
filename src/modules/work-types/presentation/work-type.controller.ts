import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { GetWorkTypesUseCase } from '../application/get-work-types.usecase';
import { CreateWorkTypeUseCase } from '../application/create-work-type.usecase';
import { CreateWorkTypesBulkUseCase } from '../application/create-work-types-bulk.usecase';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiResponse,
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

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('work-types')
export class WorkTypeController {
  constructor(
    private readonly createWorkTypeUseCase: CreateWorkTypeUseCase,
    private readonly createWorkTypesBulkUseCase: CreateWorkTypesBulkUseCase,
    private readonly getWorkTypesUseCase: GetWorkTypesUseCase,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'The list of work types has been successfully retrieved.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Please provide a valid JWT token.',
  })
  @Get()
  async getWorkTypes(@Query('projectId') projectId: string) {
    const workTypes = await this.getWorkTypesUseCase.execute(projectId);

    return WorkTypePresentationMapper.toResponseList(workTypes);
  }

  @ApiCreatedResponse({
    description: 'The work type has been successfully created.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Please provide a valid JWT token.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request. Please check the input data.',
  })
  @Roles(OrganizationRoleEnum.OWNER, OrganizationRoleEnum.MANAGER)
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

  @ApiCreatedResponse({
    description: 'Work types have been successfully created.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Please provide a valid JWT token.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request. Please check the input data.',
  })
  @Roles(OrganizationRoleEnum.OWNER, OrganizationRoleEnum.MANAGER)
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
