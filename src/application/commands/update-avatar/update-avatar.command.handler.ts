import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import type { IUserRepository } from '~/domain/repositories/user.repository.interface'
import { USER_REPOSITORY } from '~/domain/repositories/user.repository.interface'
import { UpdateAvatarCommand } from '~/application/commands/update-avatar/update-avatar.command'
import { Inject, NotFoundException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CACHE_EVENT, CACHE_RESOURCE, CACHE_TYPE } from '~/common/constants/cache.constant'
import { UploadAvatarResponseDto } from '~/presentation/dtos/user.dto'
import { UserMapper } from '~/application/mappers/user.mapper'
import { CloudinaryService } from '~/common/services/cloudinary.service'
import { extractCloudinaryPublicId, isCloudinaryUrl } from '~/common/utils/cloudinary.util'

@CommandHandler(UpdateAvatarCommand)
export class UpdateAvatarHandler implements ICommandHandler<UpdateAvatarCommand, UploadAvatarResponseDto> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly cloudinaryService: CloudinaryService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(command: UpdateAvatarCommand) {
    const { id, file } = command

    const user = await this.userRepository.findById(id)
    if (!user) throw new NotFoundException(`User doesn't exist`)

    // Lưu publicId của avatar cũ để xóa sau
    let oldAvatarPublicId: string | null = null
    if (user.avatar && isCloudinaryUrl(user.avatar)) {
      oldAvatarPublicId = extractCloudinaryPublicId(user.avatar)
    }

    // Upload avatar mới
    const uploadResult = await this.cloudinaryService.uploadImageToCloudinary(file, 'avatar')
    
    // Cập nhật user
    user.avatar = uploadResult.secure_url
    await this.userRepository.save(user)

    // Xóa avatar cũ SAU KHI đã save thành công
    // (nếu save thất bại thì không xóa ảnh cũ)
    if (oldAvatarPublicId) {
      await this.cloudinaryService.deleteImageFromCloudinary(oldAvatarPublicId)
    }

    // Invalidate cache personal user
    this.eventEmitter.emit(CACHE_EVENT.INVALIDATE, { type: CACHE_TYPE.PERSONAL, resource: CACHE_RESOURCE.USERS, id })

    return UserMapper.toUserResponse(user)
  }
}
