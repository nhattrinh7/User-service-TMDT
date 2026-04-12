import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import type { IUserRepository } from '~/domain/repositories/user.repository.interface'
import type { IAddressRepository } from '~/domain/repositories/address.repository.interface'
import { USER_REPOSITORY } from '~/domain/repositories/user.repository.interface'
import { ADDRESS_REPOSITORY } from '~/domain/repositories/address.repository.interface'
import { Inject } from '@nestjs/common'
import { GetOwnerAndAddressQuery } from '~/application/queries/get-owner-and-address/get-owner-and-address.query'
import { UserMapper } from '~/application/mappers/user.mapper'
import { AddressMapper } from '~/application/mappers/address.mapper'
import { OwnerAndAddressResult } from '~/domain/interfaces/response.interface'

@QueryHandler(GetOwnerAndAddressQuery)
export class GetOwnerAndAddressHandler
  implements IQueryHandler<GetOwnerAndAddressQuery, OwnerAndAddressResult[]>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(ADDRESS_REPOSITORY)
    private readonly addressRepository: IAddressRepository,
  ) {}

  async execute(query: GetOwnerAndAddressQuery): Promise<OwnerAndAddressResult[]> {
    const { data } = query

    // Extract unique ownerIds và addressIds
    const ownerIds = [...new Set(data.map(item => item.ownerId))]
    const addressIds = [...new Set(data.map(item => item.addressId))]

    // Lấy users và addresses từ database
    const [users, addresses] = await Promise.all([
      this.userRepository.findByIds(ownerIds),
      this.addressRepository.findByIds(addressIds),
    ])

    // Tạo lookup maps để tìm nhanh
    const userMap = new Map(users.map(user => [user.id, UserMapper.toUserResponse(user)]))
    const addressMap = new Map(
      addresses.map(address => [address.id, AddressMapper.toAddressResponse(address)]),
    )

    // Map kết quả theo shopId
    return data.map(item => ({
      shopId: item.shopId,
      owner: userMap.get(item.ownerId) || null,
      address: addressMap.get(item.addressId) || null,
    }))
  }
}
