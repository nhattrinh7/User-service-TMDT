import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { SagaVerifyPasscodeAndDeductCommand } from './saga-verify-passcode-and-deduct.command'
import type { IWalletRepository } from '~/domain/repositories/wallet.repository.interface'
import { WALLET_REPOSITORY } from '~/domain/repositories/wallet.repository.interface'
import type { IUserRepository } from '~/domain/repositories/user.repository.interface'
import { USER_REPOSITORY } from '~/domain/repositories/user.repository.interface'
import { PrismaService } from '~/infrastructure/database/prisma/prisma.service'

interface VerifyPasscodeAndDeductResult {
  success: boolean
  deductedAmount?: number
  error?: string
}

@CommandHandler(SagaVerifyPasscodeAndDeductCommand)
export class SagaVerifyPasscodeAndDeductHandler implements ICommandHandler<SagaVerifyPasscodeAndDeductCommand, VerifyPasscodeAndDeductResult> {
  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepository: IWalletRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(command: SagaVerifyPasscodeAndDeductCommand): Promise<VerifyPasscodeAndDeductResult> {
    const { userId, passcode, amount } = command

    // Verify passcode (passCode nằm trên User entity, dùng domain method verifyPassCode)
    const user = await this.userRepository.findById(userId)
    if (!user) {
      return { success: false, error: 'Người dùng không tồn tại' }
    }

    const isPasscodeValid = await user.verifyPassCode(passcode)
    if (!isPasscodeValid) {
      return { success: false, error: 'Mã passcode không đúng' }
    }

    // Transaction: check balance + deduct phải atomic để tránh race condition
    // (2 request đồng thời đều thấy đủ balance → cùng trừ)
    return this.prismaService.transaction(async (tx) => {
      // Lấy wallet trong transaction (đảm bảo isolation)
      const wallet = await this.walletRepository.findByUserId(userId, tx)
      if (!wallet) {
        throw new Error('Ví không tồn tại')
      }

      // Check balance
      if (wallet.balance < amount) {
        throw new Error('Số dư ví không đủ')
      }

      // Deduct balance (trong cùng transaction)
      await this.walletRepository.deductBalance(userId, amount, tx)

      return { success: true, deductedAmount: amount }
    }).catch((error: Error) => {
      return { success: false, error: error.message }
    })
  }
}
