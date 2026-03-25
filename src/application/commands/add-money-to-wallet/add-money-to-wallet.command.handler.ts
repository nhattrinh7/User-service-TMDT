import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject, NotFoundException } from '@nestjs/common'
import { AddMoneyToWalletCommand } from './add-money-to-wallet.command'
import type { IWalletRepository } from '~/domain/repositories/wallet.repository.interface'
import { WALLET_REPOSITORY } from '~/domain/repositories/wallet.repository.interface'

@CommandHandler(AddMoneyToWalletCommand)
export class AddMoneyToWalletHandler implements ICommandHandler<AddMoneyToWalletCommand> {
  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(command: AddMoneyToWalletCommand) {
    const { userId, amount } = command

    await this.walletRepository.addBalance(userId, amount)

    const wallet = await this.walletRepository.findByUserId(userId)
    if (!wallet) {
      throw new NotFoundException('Không tìm thấy ví người dùng')
    }

    return {
      balance: wallet.balance,
    }
  }
}
