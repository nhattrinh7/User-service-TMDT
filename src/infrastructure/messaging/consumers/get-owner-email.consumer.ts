import { Controller } from '@nestjs/common'
import { Payload, Ctx, RmqContext, MessagePattern } from '@nestjs/microservices'
import { QueryBus } from '@nestjs/cqrs'
import { BaseRetryConsumer } from '~/common/utils/base-retry.consumer'
import { GetOwnerEmailQuery } from '~/application/queries/get-owner-email/get-owner-email.query'

interface GetOwnerEmailPayload {
  ownerId: string
}

@Controller()
export class GetOwnerEmailConsumer extends BaseRetryConsumer {
  constructor(
    private readonly queryBus: QueryBus,
  ) {
    super()
  }

  @MessagePattern('get.owner-email')
  async handleGetOwnerEmail(
    @Payload() data: GetOwnerEmailPayload,
    @Ctx() context: RmqContext,
  ) {
    const result = await this.handleWithRetry(context, async () => {
      this.logger.log(`Event get.owner-email received, ownerId=${data.ownerId}`)
      return await this.queryBus.execute(new GetOwnerEmailQuery(data.ownerId))
    })

    return result
  }
}
