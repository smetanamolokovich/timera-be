import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  CurrentUser,
  type JwtUser,
} from '../../../common/decorators/current-user.decorator';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateEmployeeUseCase } from '../application/create-employee.usecase';
import { EmployeePresentationMapper } from './employee.mapper';
import { OrganizationIdRequiredError } from '../../../common/errors/organization-id-required.error';
import { GetEmployeesUseCase } from '../application/get-employees.usecase';
import { Roles } from '../../../common/decorators/roles.decorator';
import { OrganizationRoleEnum } from '../../memberships/domain/membership';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

@ApiTags('Employees')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('employees')
export class EmployeeController {
  constructor(
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
    private readonly getEmployeesUseCase: GetEmployeesUseCase,
  ) {}

  @ApiOperation({ summary: 'Create an employee' })
  @ApiResponse({
    status: 201,
    description: 'The employee has been successfully created.',
  })
  @ApiResponse({
    status: 422,
    description: 'Unprocessable Entity',
  })
  @ApiInternalServerErrorResponse({
    description: 'An unexpected error occurred.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Please provide a valid JWT token.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden. Required role: OWNER or MANAGER.',
  })
  @Roles(OrganizationRoleEnum.OWNER, OrganizationRoleEnum.MANAGER)
  @UseGuards(RolesGuard)
  @Post()
  async create(
    @CurrentUser() { organizationId }: JwtUser,
    @Body() dto: CreateEmployeeDto,
  ) {
    if (!organizationId) {
      throw new OrganizationIdRequiredError();
    }

    const employee = await this.createEmployeeUseCase.execute(
      organizationId,
      dto.name,
      dto.hourlyRate,
    );

    return EmployeePresentationMapper.toResponse(employee);
  }

  @ApiOperation({ summary: 'List employees in the organization' })
  @ApiResponse({
    status: 200,
    description: 'The list of employees has been successfully retrieved.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Please provide a valid JWT token.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @Get()
  async getByOrganization(
    @CurrentUser() { organizationId }: JwtUser,
    @Query() pagination: PaginationQueryDto,
  ) {
    if (!organizationId) throw new OrganizationIdRequiredError();

    const result = await this.getEmployeesUseCase.execute(organizationId, pagination);

    return {
      ...result,
      data: result.data.map(EmployeePresentationMapper.toResponse),
    };
  }
}
