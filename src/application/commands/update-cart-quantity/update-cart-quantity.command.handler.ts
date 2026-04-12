import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject, NotFoundException } from '@nestjs/common'
import type { IUserRepository } from '~/domain/repositories/user.repository.interface'
import { USER_REPOSITORY } from '~/domain/repositories/user.repository.interface'
import { UpdateCartQuantityCommand } from './update-cart-quantity.command'

interface UpdateCartQuantityResponse {
  productVariantId: string
  quantity: number
}

@CommandHandler(UpdateCartQuantityCommand)
export class UpdateCartQuantityHandler
  implements ICommandHandler<UpdateCartQuantityCommand, UpdateCartQuantityResponse>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: UpdateCartQuantityCommand): Promise<UpdateCartQuantityResponse> {
    const { userId, productVariantId, quantity } = command

    // Kiểm tra user có tồn tại không
    const user = await this.userRepository.findById(userId)
    if (!user) throw new NotFoundException(`User doesn't exist`)

    // Kiểm tra cart item có tồn tại không
    const existingCartItem = await this.userRepository.findCartItemByUserAndVariant(
      userId,
      productVariantId,
    )
    if (!existingCartItem) {
      throw new NotFoundException(`Cart item not found`)
    }

    // Cập nhật quantity trong DB
    await this.userRepository.updateCartItemQuantity(userId, productVariantId, quantity)

    return {
      productVariantId,
      quantity,
    }
  }
}
