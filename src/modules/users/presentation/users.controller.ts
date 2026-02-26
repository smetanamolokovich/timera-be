import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserUseCase } from '../application/register-user.usecase';
import { RegisterUserDto } from './dto/register-user.dto';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UserPresentationMapper } from './user.mapper';

@Controller('users')
export class UsersController {
  constructor(private registerUserUseCase: RegisterUserUseCase) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully registered.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data.',
  })
  @ApiInternalServerErrorResponse({
    description: 'An unexpected error occurred.',
  })
  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.registerUserUseCase.execute(
      dto.email,
      dto.password,
      dto.firstName,
      dto.lastName,
      dto.timezone,
      dto.locale,
      dto.avatarUrl,
      dto.phone,
    );

    return UserPresentationMapper.toResponse(user);
  }
}
