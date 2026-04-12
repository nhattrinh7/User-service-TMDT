import { Controller } from '@nestjs/common'
import { Payload, Ctx, RmqContext, EventPattern } from '@nestjs/microservices'
import { CommandBus } from '@nestjs/cqrs'
import { BaseRetryConsumer } from '~/common/utils/base-retry.consumer'
import { RefundWalletCommand } from '~/application/commands/refund-wallet/refund-wallet.command'

@Controller()
export class RefundWalletConsumer extends BaseRetryConsumer {
  constructor(private readonly commandBus: CommandBus) {
    super()
  }

  @EventPattern('refund.wallet')
  async handleRefundWallet(
    @Payload() data: { userId: string; amount: number },
    @Ctx() context: RmqContext,
  ) {
    await this.handleWithRetry(context, async () => {
      this.logger.log(`Event refund.wallet received, userId=${data.userId}, amount=${data.amount}`)

      await this.commandBus.execute(new RefundWalletCommand(data.userId, data.amount))

      this.logger.log(`Refund wallet completed, userId=${data.userId}, amount=${data.amount}`)
    })
  }
}
