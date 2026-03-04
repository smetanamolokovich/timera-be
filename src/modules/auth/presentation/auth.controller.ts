import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LoginUserUseCase } from '../application/login-user.usecase';
import { SwitchOrgUseCase } from '../application/switch-org.usecase';
import { RefreshTokenUseCase } from '../application/refresh-token.usecase';
import { LogoutUseCase } from '../application/logout.usecase';
import { LoginDto } from './dto/login.dto';
import { SwitchOrgDto } from './dto/sign-org.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private loginUserUseCase: LoginUserUseCase,
    private switchOrgUseCase: SwitchOrgUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private logoutUseCase: LogoutUseCase,
  ) {}

  @ApiOperation({ summary: 'Login user and get JWT token' })
  @ApiResponse({
    status: 200,
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

  @ApiOperation({ summary: 'Refresh access token using a refresh token' })
  @ApiResponse({
    status: 200,
    description: 'New access token and refresh token issued.',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired refresh token.',
  })
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.refreshTokenUseCase.execute(dto.refreshToken);
  }

  @ApiOperation({ summary: 'Logout user and invalidate refresh token' })
  @ApiResponse({
    status: 204,
    description: 'The user has been successfully logged out.',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired refresh token.',
  })
  @HttpCode(204)
  @Post('logout')
  async logout(@Body() dto: RefreshTokenDto): Promise<void> {
    return this.logoutUseCase.execute(dto.refreshToken);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Switch active organization and get new JWT token' })
  @ApiResponse({
    status: 201,
    description: 'New token with updated organizationId',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized or not a member of this organization',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('switch-org')
  async switchOrg(@CurrentUser() user: JwtUser, @Body() dto: SwitchOrgDto) {
    return this.switchOrgUseCase.execute(
      user.id,
      user.email,
      dto.organizationId,
    );
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
