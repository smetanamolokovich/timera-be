import { User } from '../domain/user';
import { UserResponseDto } from './dto/user-response.dto';

export class UserPresentationMapper {
  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
