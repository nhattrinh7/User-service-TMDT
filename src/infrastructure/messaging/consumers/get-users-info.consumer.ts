import { Controller } from '@nestjs/common'
import { Payload, Ctx, RmqContext, MessagePattern } from '@nestjs/microservices'
import { QueryBus } from '@nestjs/cqrs'
import { BaseRetryConsumer } from '~/common/utils/base-retry.consumer'
import { GetUsersInfoQuery } from '~/application/queries/get-users-info/get-users-info.query'

@Controller()
export class GetUsersInfoConsumer extends BaseRetryConsumer {
  constructor(
    private readonly queryBus: QueryBus,
  ) {
    super()
  }

  @MessagePattern('get.users_info')
  async handleGetUsersInfo(
    @Payload() data: { userIds: string[] },
    @Ctx() context: RmqContext,
  ) {
    console.log('Event get.users_info received:', data)

    const result = await this.handleWithRetry(context, async () => {
      return await this.queryBus.execute(new GetUsersInfoQuery(data.userIds))
    })

    return result
  }
}
