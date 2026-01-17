import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import type { IUserRepository } from '~/domain/repositories/user.repository.interface'
import { USER_REPOSITORY } from '~/domain/repositories/user.repository.interface'
import { UnbanUserCommand } from '~/application/commands/unban-user/unban-user.command'
import { Inject, NotFoundException } from '@nestjs/common'
import { UserStatus } from '~/domain/enums/user.enum'

@CommandHandler(UnbanUserCommand)
export class UnbanUserHandler implements ICommandHandler<UnbanUserCommand, void> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: UnbanUserCommand) {
    const { userId } = command

    const user = await this.userRepository.findById(userId)
    if (!user) throw new NotFoundException(`User doesn't exist`)

    await this.userRepository.updateStatus(userId, UserStatus.ACTIVE)
  }
}
