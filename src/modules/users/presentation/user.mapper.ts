import { User } from '../domain/user';
import { UserResponseDto } from './dto/user-response.dto';

export class UserPresentationMapper {
  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      timezone: user.timezone,
      locale: user.locale,
      phone: user.phone,
      createdAt: user.createdAt,
    };
  }
}
