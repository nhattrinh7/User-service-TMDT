import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import type { IUserRepository } from '~/domain/repositories/user.repository.interface'
import { USER_REPOSITORY } from '~/domain/repositories/user.repository.interface'
import { UnbanUserCommand } from '~/application/commands/unban-user/unban-user.command'
import { Inject, NotFoundException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CACHE_EVENT, CACHE_RESOURCE, CACHE_TYPE } from '~/common/constants/cache.constant'
import { UserStatus } from '~/domain/enums/user.enum'

@CommandHandler(UnbanUserCommand)
export class UnbanUserHandler implements ICommandHandler<UnbanUserCommand, void> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(command: UnbanUserCommand) {
    const { userId } = command

    const user = await this.userRepository.findById(userId)
    if (!user) throw new NotFoundException(`User doesn't exist`)

    await this.userRepository.updateStatus(userId, UserStatus.ACTIVE)

    // Invalidate cache personal user
    this.eventEmitter.emit(CACHE_EVENT.INVALIDATE, {
      type: CACHE_TYPE.PERSONAL,
      resource: CACHE_RESOURCE.USERS,
      id: userId,
    })
  }
}
