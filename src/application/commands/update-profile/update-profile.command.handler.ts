import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import type { IUserRepository } from '~/domain/repositories/user.repository.interface'
import { USER_REPOSITORY } from '~/domain/repositories/user.repository.interface'
import { UpdateProfileCommand } from '~/application/commands/update-profile/update-profile.command'
import { ConflictException, Inject, NotFoundException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CACHE_EVENT, CACHE_RESOURCE, CACHE_TYPE } from '~/common/constants/cache.constant'
import { UpdateProfileResponseDto } from '~/presentation/dtos/user.dto'
import { UserMapper } from '~/application/mappers/user.mapper'

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler
  implements ICommandHandler<UpdateProfileCommand, UpdateProfileResponseDto>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly eventEmitter: EventEmitter2,
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

    // Invalidate cache personal user
    this.eventEmitter.emit(CACHE_EVENT.INVALIDATE, {
      type: CACHE_TYPE.PERSONAL,
      resource: CACHE_RESOURCE.USERS,
      id,
    })

    return UserMapper.toUserResponse(savedUser)
  }
}
