import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject, NotFoundException } from '@nestjs/common'
import { GetWalletBalanceQuery } from './get-wallet-balance.query'
import type { IWalletRepository } from '~/domain/repositories/wallet.repository.interface'
import { WALLET_REPOSITORY } from '~/domain/repositories/wallet.repository.interface'

@QueryHandler(GetWalletBalanceQuery)
export class GetWalletBalanceHandler implements IQueryHandler<GetWalletBalanceQuery> {
  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(query: GetWalletBalanceQuery) {
    const { userId } = query

    const wallet = await this.walletRepository.findByUserId(userId)
    if (!wallet) {
      throw new NotFoundException('Không tìm thấy ví người dùng')
    }

    return {
      balance: wallet.balance,
    }
  }
}
