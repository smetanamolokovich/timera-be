import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  CurrentUser,
  type JwtUser,
} from '../../../common/decorators/current-user.decorator';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateEmployeeUseCase } from '../application/create-employee.usecase';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly createEmployeeUseCase: CreateEmployeeUseCase) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new employee' })
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
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@CurrentUser() { id }: JwtUser, @Body() dto: CreateEmployeeDto) {
    return await this.createEmployeeUseCase.execute(
      id,
      dto.name,
      dto.hourlyRate,
    );
  }
}
