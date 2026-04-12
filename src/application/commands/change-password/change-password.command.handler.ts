import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ChangePasswordCommand } from '~/application/commands/change-password/change-password.command'
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common'
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '~/domain/repositories/user.repository.interface'

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler implements ICommandHandler<ChangePasswordCommand, void> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: ChangePasswordCommand) {
    const { id, body } = command

    const user = await this.userRepository.findById(id)
    if (!user) throw new NotFoundException(`User doesn't exist`)

    // Kiểm tra mật khẩu hiện tại có khớp không
    const isPasswordValid = await user.verifyPassword(body.currentPassword)
    if (!isPasswordValid) throw new BadRequestException('Mật khẩu hiện tại không đúng')

    await user.changePassword(body.newPassword)

    // Lưu vào database
    await this.userRepository.save(user)
  }
}
