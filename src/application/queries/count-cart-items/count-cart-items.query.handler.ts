import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import type { IUserRepository } from '~/domain/repositories/user.repository.interface'
import { USER_REPOSITORY } from '~/domain/repositories/user.repository.interface'
import { Inject, NotFoundException } from '@nestjs/common'
import { CountCartItemsQuery } from '~/application/queries/count-cart-items/count-cart-items.query'

@QueryHandler(CountCartItemsQuery)
export class CountCartItemsHandler
  implements IQueryHandler<CountCartItemsQuery, { count: number }>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: CountCartItemsQuery) {
    const { userId } = query

    // Kiểm tra user có tồn tại không
    const user = await this.userRepository.findById(userId)
    if (!user) throw new NotFoundException(`User doesn't exist`)

    // Đếm số lượng cart items của user
    const count = await this.userRepository.countCartItems(userId)

    return { count }
  }
}
