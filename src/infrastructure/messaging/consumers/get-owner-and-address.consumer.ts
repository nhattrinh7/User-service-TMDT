import { Controller } from '@nestjs/common'
import { Payload, Ctx, RmqContext, MessagePattern } from '@nestjs/microservices'
import { QueryBus } from '@nestjs/cqrs'
import { BaseRetryConsumer } from '~/common/utils/base-retry.consumer'
import { GetOwnerAndAddressQuery, type GetOwnerAndAddressPayload } from '~/application/queries/get-owner-and-address/get-owner-and-address.query'

@Controller()
export class GetOwnerAndAddressConsumer extends BaseRetryConsumer {
  constructor(
    private readonly queryBus: QueryBus,
  ) {
    super()
  }

  @MessagePattern('get.owner_and_address')
  async handleGetOwnerAndAddress(
    @Payload() data: GetOwnerAndAddressPayload[],
    @Ctx() context: RmqContext,
  ) {
    console.log('Event get.owner_and_address received:', data)

    const result = await this.handleWithRetry(context, async () => {
      return await this.queryBus.execute(new GetOwnerAndAddressQuery(data))
    })

    return result
  }
}
