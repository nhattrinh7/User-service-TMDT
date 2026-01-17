import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import type { IUserRepository } from '~/domain/repositories/user.repository.interface'
import type { IAddressRepository } from '~/domain/repositories/address.repository.interface'
import { USER_REPOSITORY } from '~/domain/repositories/user.repository.interface'
import { ADDRESS_REPOSITORY } from '~/domain/repositories/address.repository.interface'
import { Inject, NotFoundException } from '@nestjs/common'
import { GetDefaultAddressQuery } from '~/application/queries/get-default-address/get-default-address.command'
import { AddressDto } from '~/presentation/dtos/address.dto'
import { AddressMapper } from '~/application/mappers/address.mapper'

@QueryHandler(GetDefaultAddressQuery)
export class GetDefaultAddressHandler implements IQueryHandler<GetDefaultAddressQuery, AddressDto | null> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(ADDRESS_REPOSITORY)
    private readonly addressRepository: IAddressRepository,
  ) {}

  async execute(query: GetDefaultAddressQuery) {
    const { userId } = query

    const user = await this.userRepository.findById(userId)
    if (!user) throw new NotFoundException(`User doesn't exist`)

    // Query địa chỉ với id của user
    const address = await this.addressRepository.getDefaultAddressByUserId(user.id)
    if (!address) return null

    return AddressMapper.toAddressResponse(address)
  }
}