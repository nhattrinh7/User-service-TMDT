import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import type { IUserRepository } from '~/domain/repositories/user.repository.interface'
import { USER_REPOSITORY } from '~/domain/repositories/user.repository.interface'
import { UpdateProfileCommand } from '~/application/commands/update-profile/update-profile.command'
import { ConflictException, Inject, NotFoundException } from '@nestjs/common'
import { UpdateProfileResponseDto } from '~/presentation/dtos/user.dto'
import { UserMapper } from '~/application/mappers/user.mapper'

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler implements ICommandHandler<UpdateProfileCommand, UpdateProfileResponseDto> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: UpdateProfileCommand) {
    const { id, body } = command

    const user = await this.userRepository.findById(id)
    if (!user) throw new NotFoundException(`User doesn't exist`)

    // Có người thì check username gửi lên có trùng với username của ai đó k
    const existingUser = await this.userRepository.findByUsername(body.username)
    if (existingUser) {
      throw new ConflictException(`Username "${body.username}" already exists`)
    }

    const savedUser = await this.userRepository.update(user.id, body)

    return UserMapper.toUserResponse(savedUser)
  }
}
