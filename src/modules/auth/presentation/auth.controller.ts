import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LoginUserUseCase } from '../application/login-user.usecase';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  CurrentUser,
  type JwtUser,
} from '../../../common/decorators/current-user.decorator';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private loginUserUseCase: LoginUserUseCase) {}

  @ApiOperation({ summary: 'Login user and get JWT token' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully logged in.',
  })
  @ApiResponse({
    status: 409,
    description: 'Invalid email or password.',
  })
  @ApiInternalServerErrorResponse({
    description: 'An unexpected error occurred.',
  })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.loginUserUseCase.execute(dto.email, dto.password);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get the profile of the currently logged-in user' })
  @ApiResponse({
    status: 200,
    description: 'The user profile has been successfully retrieved.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Please provide a valid JWT token.',
  })
  @Get('me')
  getProfile(@CurrentUser() user: JwtUser) {
    return user;
  }
}
