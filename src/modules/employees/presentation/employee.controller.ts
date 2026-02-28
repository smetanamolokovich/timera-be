import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
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

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('employees')
export class EmployeeController {
  constructor(
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
    private readonly getEmployeesUseCase: GetEmployeesUseCase,
  ) {}

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

  @ApiResponse({
    status: 200,
    description: 'The list of employees has been successfully retrieved.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Please provide a valid JWT token.',
  })
  @Get()
  async getByOrganization(@CurrentUser() { organizationId }: JwtUser) {
    if (!organizationId) throw new OrganizationIdRequiredError();

    const employees = await this.getEmployeesUseCase.execute(organizationId);

    return EmployeePresentationMapper.toResponseList(employees);
  }
}
