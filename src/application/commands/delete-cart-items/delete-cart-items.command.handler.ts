import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject, NotFoundException } from '@nestjs/common'
import type { IUserRepository } from '~/domain/repositories/user.repository.interface'
import { USER_REPOSITORY } from '~/domain/repositories/user.repository.interface'
import { DeleteCartItemsCommand } from './delete-cart-items.command'

@CommandHandler(DeleteCartItemsCommand)
export class DeleteCartItemsHandler
  implements ICommandHandler<DeleteCartItemsCommand, { deletedCount: number }>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: DeleteCartItemsCommand): Promise<{ deletedCount: number }> {
    const { userId, productVariantIds } = command

    // Kiểm tra user có tồn tại không
    const user = await this.userRepository.findById(userId)
    if (!user) throw new NotFoundException(`User doesn't exist`)

    // Xóa các cart items theo productVariantIds
    const deletedCount = await this.userRepository.deleteCartItems(userId, productVariantIds)

    return { deletedCount }
  }
}
