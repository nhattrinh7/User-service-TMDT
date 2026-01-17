import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import type { IUserRepository } from '~/domain/repositories/user.repository.interface'
import { USER_REPOSITORY } from '~/domain/repositories/user.repository.interface'
import { Inject } from '@nestjs/common'
import { UserMapper } from '~/application/mappers/user.mapper'
import { GetUsersPaginatedQuery } from '~/application/queries/get-users-paginated/get-users-paginated.query'

@QueryHandler(GetUsersPaginatedQuery)
export class GetUsersPaginatedHandler implements IQueryHandler<GetUsersPaginatedQuery> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUsersPaginatedQuery) {
    const { page, limit, search, status } = query

    const result = await this.userRepository.getUsersPaginated(page, limit, search, status)

    return {
      users: result.data.map((user) => UserMapper.toUserResponse(user)),
      meta: result.meta,
    }
  }
}