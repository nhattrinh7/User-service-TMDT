import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import type { IUserRepository } from '~/domain/repositories/user.repository.interface'
import type { IAddressRepository } from '~/domain/repositories/address.repository.interface'
import { USER_REPOSITORY } from '~/domain/repositories/user.repository.interface'
import { ADDRESS_REPOSITORY } from '~/domain/repositories/address.repository.interface'
import { Inject, NotFoundException } from '@nestjs/common'
import { GetAddressesQuery } from '~/application/queries/get-addresses/get-addresses.query'
import { AddressDto } from '~/presentation/dtos/address.dto'
import { AddressMapper } from '~/application/mappers/address.mapper'

@QueryHandler(GetAddressesQuery)
export class GetAddressesHandler implements IQueryHandler<GetAddressesQuery, AddressDto[]> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(ADDRESS_REPOSITORY)
    private readonly addressRepository: IAddressRepository,
  ) {}

  async execute(query: GetAddressesQuery) {
    const { userId } = query

    const user = await this.userRepository.findById(userId)
    if (!user) throw new NotFoundException(`User doesn't exist`)

    // Query địa chỉ với id của user
    const addresses = await this.addressRepository.getAddressesByUserId(user.id)

    return AddressMapper.toAddressesResponse(addresses || [])
  }
}