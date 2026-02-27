import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { RegisterUserUseCase } from '../application/register-user.usecase';
import { RegisterUserDto } from './dto/register-user.dto';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserPresentationMapper } from './user.mapper';
import { AuthGuard } from '@nestjs/passport';
import {
  CurrentUser,
  type JwtUser,
} from '../../../common/decorators/current-user.decorator';
import { UpdateMeUseCase } from '../application/update-me.usecase';
import { GetMeUseCase } from '../application/get-me.usecase';
import { UpdateMeDto } from './dto/update-me.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private getMeUseCase: GetMeUseCase,
    private updateMeUseCase: UpdateMeUseCase,
  ) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiInternalServerErrorResponse({
    description: 'An unexpected error occurred',
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
      dto.inviteToken,
    );

    return UserPresentationMapper.toResponse(user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@CurrentUser() user: JwtUser) {
    const userProfile = await this.getMeUseCase.execute(user.id);
    return UserPresentationMapper.toResponse(userProfile);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Updated user profile',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  async updateMe(@CurrentUser() user: JwtUser, @Body() dto: UpdateMeDto) {
    const updatedUser = await this.updateMeUseCase.execute(user.id, dto);
    return UserPresentationMapper.toResponse(updatedUser);
  }
}
