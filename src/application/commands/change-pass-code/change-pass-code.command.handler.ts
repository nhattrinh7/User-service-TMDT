import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ChangePassCodeCommand } from '~/application/commands/change-pass-code/change-pass-code.command'
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common'
import { type IUserRepository, USER_REPOSITORY } from '~/domain/repositories/user.repository.interface'

@CommandHandler(ChangePassCodeCommand)
export class ChangePassCodeHandler implements ICommandHandler<ChangePassCodeCommand, void> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: ChangePassCodeCommand) {
    const { userId, body } = command

    const user = await this.userRepository.findById(userId)
    if (!user) throw new NotFoundException('User không tồn tại')

    try {
      await user.changePassCode(body.currentPassCode, body.newPassCode)
    } catch (error) {
      throw new BadRequestException(error.message)
    }

    await this.userRepository.save(user)
  }
}
