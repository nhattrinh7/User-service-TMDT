import { Injectable } from '@nestjs/common'
import { PrismaService } from '~/infrastructure/database/prisma/prisma.service'
import { IWalletRepository } from '~/domain/repositories/wallet.repository.interface'

@Injectable()
export class WalletRepository implements IWalletRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string, tx?: any): Promise<{
    userId: string
    balance: number
  } | null> {
    const client = tx || this.prisma
    const wallet = await client.wallet.findUnique({
      where: { userId },
    })

    if (!wallet) return null

    return {
      userId: wallet.userId,
      balance: Number(wallet.balance),
    }
  }

  async deductBalance(userId: string, amount: number, tx?: any): Promise<void> {
    const client = tx || this.prisma
    await client.wallet.update({
      where: { userId },
      data: { balance: { decrement: amount } },
    })
  }

  async addBalance(userId: string, amount: number): Promise<void> {
    await this.prisma.wallet.update({
      where: { userId },
      data: { balance: { increment: amount } },
    })
  }

  async refundBalance(userId: string, amount: number): Promise<void> {
    await this.prisma.wallet.update({
      where: { userId },
      data: { balance: { increment: amount } },
    })
  }
}
