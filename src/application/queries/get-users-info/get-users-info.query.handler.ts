import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { USER_REPOSITORY, type IUserRepository } from '~/domain/repositories/user.repository.interface'
import { GetUsersInfoQuery } from '~/application/queries/get-users-info/get-users-info.query'

export interface UserInfoDto {
  id: string
  username: string
  avatar: string | null
}

@QueryHandler(GetUsersInfoQuery)
export class GetUsersInfoHandler implements IQueryHandler<GetUsersInfoQuery, UserInfoDto[]> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUsersInfoQuery): Promise<UserInfoDto[]> {
    const { userIds } = query

    if (userIds.length === 0) {
      return []
    }

    // Lấy users từ database
    const users = await this.userRepository.findByIds(userIds)

    // Map sang UserInfoDto (chỉ id, username, avatar)
    return users.map(user => ({
      id: user.id,
      username: user.username,
      avatar: user.avatar,
    }))
  }
}
