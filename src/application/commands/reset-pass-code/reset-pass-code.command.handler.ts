import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ResetPassCodeCommand } from '~/application/commands/reset-pass-code/reset-pass-code.command'
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common'
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '~/domain/repositories/user.repository.interface'

@CommandHandler(ResetPassCodeCommand)
export class ResetPassCodeHandler implements ICommandHandler<ResetPassCodeCommand, void> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: ResetPassCodeCommand) {
    const { userId, body } = command

    const user = await this.userRepository.findById(userId)
    if (!user) throw new NotFoundException('User không tồn tại')

    try {
      await user.resetPassCode(body.otp, body.newPassCode)
    } catch (error) {
      throw new BadRequestException(error.message)
    }

    await this.userRepository.save(user)
  }
}
