import { Controller } from '@nestjs/common'
import { Payload, Ctx, RmqContext, MessagePattern } from '@nestjs/microservices'
import { CommandBus } from '@nestjs/cqrs'
import { BaseRetryConsumer } from '~/common/utils/base-retry.consumer'
import { UpdateUserRoleCommand } from '~/application/commands/update-user-role/update-user-role.command'

interface UpdateUserRolePayload {
  userId: string
}

@Controller()
export class UpdateUserRoleConsumer extends BaseRetryConsumer {
  constructor(
    private readonly commandBus: CommandBus,
  ) {
    super()
  }

  @MessagePattern('update.user-role')
  async handleUpdateUserRole(
    @Payload() data: UpdateUserRolePayload,
    @Ctx() context: RmqContext,
  ) {
    const result = await this.handleWithRetry(context, async () => {
      this.logger.log(`Event update.user-role received, userId=${data.userId}`)

      await this.commandBus.execute(new UpdateUserRoleCommand(data.userId))

      return { success: true }
    })

    return result
  }
}
