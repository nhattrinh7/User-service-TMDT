import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreatePassCodeCommand } from '~/application/commands/create-pass-code/create-pass-code.command'
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common'
import { type IUserRepository, USER_REPOSITORY } from '~/domain/repositories/user.repository.interface'

@CommandHandler(CreatePassCodeCommand)
export class CreatePassCodeHandler implements ICommandHandler<CreatePassCodeCommand, void> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: CreatePassCodeCommand) {
    const { userId, body } = command

    const user = await this.userRepository.findById(userId)
    if (!user) throw new NotFoundException('User không tồn tại')

    try {
      await user.createPassCode(body.passCode)
    } catch (error) {
      throw new BadRequestException(error.message)
    }

    await this.userRepository.save(user)
  }
}
