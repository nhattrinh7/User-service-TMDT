import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import type { IUserRepository } from '~/domain/repositories/user.repository.interface'
import { USER_REPOSITORY } from '~/domain/repositories/user.repository.interface'
import { BanUserCommand } from '~/application/commands/ban-user/ban-user.command'
import { Inject, NotFoundException } from '@nestjs/common'
import { UserStatus } from '~/domain/enums/user.enum'

@CommandHandler(BanUserCommand)
export class BanUserHandler implements ICommandHandler<BanUserCommand, void> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: BanUserCommand) {
    const { userId } = command

    const user = await this.userRepository.findById(userId)
    if (!user) throw new NotFoundException(`User doesn't exist`)

    await this.userRepository.updateStatus(userId, UserStatus.BANNED)
  }
}
