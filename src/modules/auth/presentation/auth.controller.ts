import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LoginUserUseCase } from '../application/login-user.usecase';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private loginUserUseCase: LoginUserUseCase) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.loginUserUseCase.execute(dto.email, dto.password);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@CurrentUser() user) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user;
  }
}
