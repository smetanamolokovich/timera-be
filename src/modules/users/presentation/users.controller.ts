import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserUseCase } from '../application/register-user.usecase';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserMapper } from '../infra/user.mapper';

@Controller('users')
export class UsersController {
  constructor(private registerUserUseCase: RegisterUserUseCase) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.registerUserUseCase.execute(
      dto.email,
      dto.password,
    );

    return UserMapper.toResponse(user);
  }
}
