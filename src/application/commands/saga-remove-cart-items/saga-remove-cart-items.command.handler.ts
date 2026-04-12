import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { SagaRemoveCartItemsCommand } from './saga-remove-cart-items.command'
import type { IUserRepository } from '~/domain/repositories/user.repository.interface'
import { USER_REPOSITORY } from '~/domain/repositories/user.repository.interface'

interface RemoveCartItemsResult {
  success: boolean
  error?: string
}

@CommandHandler(SagaRemoveCartItemsCommand)
export class SagaRemoveCartItemsHandler
  implements ICommandHandler<SagaRemoveCartItemsCommand, RemoveCartItemsResult>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: SagaRemoveCartItemsCommand): Promise<RemoveCartItemsResult> {
    const { userId, productVariantIds } = command

    await this.userRepository.deleteCartItems(userId, productVariantIds)

    return { success: true }
  }
}
