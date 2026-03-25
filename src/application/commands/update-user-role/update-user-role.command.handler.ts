import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import type { IUserRepository } from '~/domain/repositories/user.repository.interface'
import { USER_REPOSITORY } from '~/domain/repositories/user.repository.interface'
import { UpdateUserRoleCommand } from '~/application/commands/update-user-role/update-user-role.command'
import { Inject, NotFoundException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CACHE_EVENT, CACHE_RESOURCE, CACHE_TYPE } from '~/common/constants/cache.constant'
import { RoleName } from '~/common/constants/constant'

@CommandHandler(UpdateUserRoleCommand)
export class UpdateUserRoleHandler implements ICommandHandler<UpdateUserRoleCommand, void> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(command: UpdateUserRoleCommand) {
    const { userId } = command

    const user = await this.userRepository.findById(userId)
    if (!user) throw new NotFoundException(`User doesn't exist`)

    const sellerRoleId = await this.userRepository.findRoleIdByName(RoleName.SELLER)
    if (!sellerRoleId) throw new NotFoundException('Role SELLER not found')

    await this.userRepository.updateRole(userId, sellerRoleId)

    // Invalidate cache personal user
    this.eventEmitter.emit(CACHE_EVENT.INVALIDATE, { type: CACHE_TYPE.PERSONAL, resource: CACHE_RESOURCE.USERS, id: userId })
  }
}
