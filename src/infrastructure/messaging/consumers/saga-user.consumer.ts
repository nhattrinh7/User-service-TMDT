import { Controller, Inject } from '@nestjs/common'
import { Payload, Ctx, RmqContext, EventPattern } from '@nestjs/microservices'
import { CommandBus } from '@nestjs/cqrs'
import { BaseRetryConsumer } from '~/common/utils/base-retry.consumer'
import { SagaGetAddressCommand } from '~/application/commands/saga-get-address/saga-get-address.command'
import { SagaRemoveCartItemsCommand } from '~/application/commands/saga-remove-cart-items/saga-remove-cart-items.command'
import { SagaVerifyPasscodeAndDeductCommand } from '~/application/commands/saga-verify-passcode-and-deduct/saga-verify-passcode-and-deduct.command'
import { SagaRefundWalletCommand } from '~/application/commands/saga-refund-wallet/saga-refund-wallet.command'
import type { IMessagePublisher } from '~/domain/contracts/message-publisher.interface'
import { MESSAGE_PUBLISHER } from '~/domain/contracts/message-publisher.interface'
import { getKongRequestId } from '~/common/context/request-context'

@Controller()
export class SagaUserConsumer extends BaseRetryConsumer {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(MESSAGE_PUBLISHER)
    private readonly messagePublisher: IMessagePublisher,
  ) {
    super()
  }

  @EventPattern('saga.get-address')
  async handleGetAddress(
    @Payload() data: { sagaId: string; userId: string; addressId: string },
    @Ctx() context: RmqContext,
  ) {
    await this.handleWithRetry(context, async () => {
      this.logger.log(`[${getKongRequestId()}] Event saga.get-address received, sagaId=${data.sagaId}`)

      try {
        const result = await this.commandBus.execute(
          new SagaGetAddressCommand(data.sagaId, data.userId, data.addressId),
        )

        if (!result.success) {
          this.messagePublisher.emitToSagaOrchestrator('saga.result.get-address', {
            sagaId: data.sagaId,
            success: false,
            error: result.error,
          })
          return
        }

        this.messagePublisher.emitToSagaOrchestrator('saga.result.get-address', {
          sagaId: data.sagaId,
          success: true,
          address: result.address,
        })
      } catch (error: any) {
        this.logger.error(`[${getKongRequestId()}] saga.get-address failed, sagaId=${data.sagaId}: ${error.message}`)
        this.messagePublisher.emitToSagaOrchestrator('saga.result.get-address', {
          sagaId: data.sagaId,
          success: false,
          error: error.message || 'Lỗi lấy địa chỉ',
        })
      }
    })
  }

  @EventPattern('saga.remove-cart-items')
  async handleRemoveCartItems(
    @Payload() data: { sagaId: string; userId: string; productVariantIds: string[] },
    @Ctx() context: RmqContext,
  ) {
    await this.handleWithRetry(context, async () => {
      this.logger.log(`[${getKongRequestId()}] Event saga.remove-cart-items received, sagaId=${data.sagaId}`)

      try {
        const result = await this.commandBus.execute(
          new SagaRemoveCartItemsCommand(data.sagaId, data.userId, data.productVariantIds),
        )

        this.messagePublisher.emitToSagaOrchestrator('saga.result.remove-cart-items', {
          sagaId: data.sagaId,
          success: result.success,
        })
      } catch (error: any) {
        this.logger.error(`[${getKongRequestId()}] saga.remove-cart-items failed, sagaId=${data.sagaId}: ${error.message}`)
        this.messagePublisher.emitToSagaOrchestrator('saga.result.remove-cart-items', {
          sagaId: data.sagaId,
          success: false,
          error: error.message || 'Lỗi xóa giỏ hàng',
        })
      }
    })
  }

  @EventPattern('saga.verify-passcode-and-deduct')
  async handleVerifyPasscodeAndDeduct(
    @Payload() data: { sagaId: string; userId: string; passcode: string; amount: number },
    @Ctx() context: RmqContext,
  ) {
    await this.handleWithRetry(context, async () => {
      this.logger.log(`[${getKongRequestId()}] Event saga.verify-passcode-and-deduct received, sagaId=${data.sagaId}`)

      try {
        const result = await this.commandBus.execute(
          new SagaVerifyPasscodeAndDeductCommand(data.sagaId, data.userId, data.passcode, data.amount),
        )

        if (!result.success) {
          this.messagePublisher.emitToSagaOrchestrator('saga.result.verify-passcode-and-deduct', {
            sagaId: data.sagaId,
            success: false,
            error: result.error,
          })
          return
        }

        this.messagePublisher.emitToSagaOrchestrator('saga.result.verify-passcode-and-deduct', {
          sagaId: data.sagaId,
          success: true,
          deductedAmount: result.deductedAmount,
        })
      } catch (error: any) {
        this.logger.error(`[${getKongRequestId()}] saga.verify-passcode-and-deduct failed, sagaId=${data.sagaId}: ${error.message}`)
        this.messagePublisher.emitToSagaOrchestrator('saga.result.verify-passcode-and-deduct', {
          sagaId: data.sagaId,
          success: false,
          error: error.message || 'Lỗi thanh toán ví',
        })
      }
    })
  }

  @EventPattern('saga.refund-wallet')
  async handleRefundWallet(
    @Payload() data: { sagaId: string; userId: string; amount: number },
    @Ctx() context: RmqContext,
  ) {
    await this.handleWithRetry(context, async () => {
      this.logger.log(`[${getKongRequestId()}] Event saga.refund-wallet received, sagaId=${data.sagaId}`)

      try {
        await this.commandBus.execute(
          new SagaRefundWalletCommand(data.sagaId, data.userId, data.amount),
        )
      } catch (error: any) {
        this.logger.error(`[${getKongRequestId()}] saga.refund-wallet failed, sagaId=${data.sagaId}: ${error.message}`)
      }
    })
  }
}
