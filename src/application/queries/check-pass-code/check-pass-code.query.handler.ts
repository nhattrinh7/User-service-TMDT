import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { Inject, NotFoundException } from '@nestjs/common'
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '~/domain/repositories/user.repository.interface'
import { CheckPassCodeQuery } from '~/application/queries/check-pass-code/check-pass-code.query'

@QueryHandler(CheckPassCodeQuery)
export class CheckPassCodeHandler
  implements IQueryHandler<CheckPassCodeQuery, { hasPassCode: boolean }>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: CheckPassCodeQuery) {
    const { userId } = query

    const user = await this.userRepository.findById(userId)
    if (!user) throw new NotFoundException('User không tồn tại')

    return { hasPassCode: user.hasPassCode() }
  }
}
