import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { RefundWalletCommand } from './refund-wallet.command'
import type { IWalletRepository } from '~/domain/repositories/wallet.repository.interface'
import { WALLET_REPOSITORY } from '~/domain/repositories/wallet.repository.interface'

@CommandHandler(RefundWalletCommand)
export class RefundWalletHandler implements ICommandHandler<RefundWalletCommand> {
  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(command: RefundWalletCommand): Promise<void> {
    const { userId, amount } = command

    await this.walletRepository.refundBalance(userId, amount)
  }
}
