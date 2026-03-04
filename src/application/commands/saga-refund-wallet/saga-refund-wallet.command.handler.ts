import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { SagaRefundWalletCommand } from './saga-refund-wallet.command'
import type { IWalletRepository } from '~/domain/repositories/wallet.repository.interface'
import { WALLET_REPOSITORY } from '~/domain/repositories/wallet.repository.interface'

@CommandHandler(SagaRefundWalletCommand)
export class SagaRefundWalletHandler implements ICommandHandler<SagaRefundWalletCommand> {
  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(command: SagaRefundWalletCommand): Promise<void> {
    const { userId, amount } = command

    await this.walletRepository.refundBalance(userId, amount)
  }
}
