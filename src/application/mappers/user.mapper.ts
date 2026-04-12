import { User } from '~/domain/entities/user.entity'
import { UserDto } from '~/presentation/dtos/user.dto'

export class UserMapper {
  static toUserResponse(user: User): UserDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email.value,
      roleId: user.roleId,
      fullName: user.fullName.value,
      phoneNumber: user.phoneNumber.value,
      dob: user.dob,
      gender: user.gender,
      avatar: user.avatar,
      status: user.status,
      require2FA: user.require2FA,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
