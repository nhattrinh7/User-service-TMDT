import { Controller } from '@nestjs/common'
import { Payload, Ctx, RmqContext, MessagePattern } from '@nestjs/microservices'
import { QueryBus } from '@nestjs/cqrs'
import { BaseRetryConsumer } from '~/common/utils/base-retry.consumer'
import { GetLeafCategoryIdsQuery } from '~/application/queries/get-leaf-category-ids/get-leaf-category-ids.query'

@Controller()
export class GetLeafCategoryIdsConsumer extends BaseRetryConsumer {
  constructor(
    private readonly queryBus: QueryBus,
  ) {
    super()
  }

  @MessagePattern('get.leaf_categoryIds')
  async handleGetLeafCategoryIds(
    @Payload() roleId: string,
    @Ctx() context: RmqContext,
  ) {
    console.log('Event get.leaf_categoryIds received:', roleId)

    const result = await this.handleWithRetry(context, async () => {
      return await this.queryBus.execute(new GetLeafCategoryIdsQuery(roleId))
    })

    return result
  }
}
