import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import type { IUserRepository } from '~/domain/repositories/user.repository.interface'
import { USER_REPOSITORY } from '~/domain/repositories/user.repository.interface'
import { Inject, NotFoundException } from '@nestjs/common'
import { UserMapper } from '~/application/mappers/user.mapper'
import { GetProfileQuery } from '~/application/queries/get-profile/get-profile.query'
import { GetProfileResponseDto } from '~/presentation/dtos/user.dto'

@QueryHandler(GetProfileQuery)
export class GetProfileHandler implements IQueryHandler<GetProfileQuery, GetProfileResponseDto> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetProfileQuery) {
    const { id } = query

    const user = await this.userRepository.findById(id)
    if (!user) throw new NotFoundException(`User doesn't exist`)

    return UserMapper.toUserResponse(user)
  }
}