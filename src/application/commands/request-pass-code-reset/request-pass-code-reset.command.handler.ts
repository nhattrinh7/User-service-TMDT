import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { RequestPassCodeResetCommand } from '~/application/commands/request-pass-code-reset/request-pass-code-reset.command'
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common'
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '~/domain/repositories/user.repository.interface'
import {
  type IMessagePublisher,
  MESSAGE_PUBLISHER,
} from '~/domain/contracts/message-publisher.interface'

@CommandHandler(RequestPassCodeResetCommand)
export class RequestPassCodeResetHandler
  implements ICommandHandler<RequestPassCodeResetCommand, void>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(MESSAGE_PUBLISHER)
    private readonly messagePublisher: IMessagePublisher,
  ) {}

  async execute(command: RequestPassCodeResetCommand) {
    const { userId } = command

    const user = await this.userRepository.findById(userId)
    if (!user) throw new NotFoundException('User không tồn tại')

    let otp
    try {
      otp = user.requestPassCodeReset()
    } catch (error) {
      throw new BadRequestException(error.message)
    }

    // Lưu OTP vào DB
    await this.userRepository.save(user)

    // Gửi OTP đến email qua notification-service
    this.messagePublisher.publish('send_passcode_reset_otp', {
      email: user.email.value,
      otp: otp.getCode(),
      expiryMinutes: otp.getExpiry(),
    })
  }
}
