import { Address as PrismaAddress } from '@prisma/client'
import { Address } from '~/domain/entities/address.entity'
import { PhoneNumber } from '~/domain/value-objects/phone-number.vo'

export class AddressMapper {
  static toSingleDomainAddress(prismaAddress: PrismaAddress | null): Address | null {
    if (!prismaAddress) return null
    return new Address(
      prismaAddress.id,
      prismaAddress.userId,
      prismaAddress.recipientName,
      PhoneNumber.create(prismaAddress.recipientPhoneNumber ?? ''),
      prismaAddress.province,
      prismaAddress.ward,
      prismaAddress.detail,
      prismaAddress.isDefault,
      prismaAddress.createdAt,
      prismaAddress.updatedAt,
    )
  }

  static toDomain(addresses: PrismaAddress[]): Address[] {
    return addresses
      .map(address => this.toSingleDomainAddress(address))
      .filter((address): address is Address => address !== null)
  }

  static toPersistence(userAddress: Address) {
    return {
      id: userAddress.id,
      userId: userAddress.userId,
      recipientName: userAddress.recipientName,
      recipientPhoneNumber: userAddress.recipientPhoneNumber.value,
      province: userAddress.province,
      ward: userAddress.ward,
      detail: userAddress.detail,
      isDefault: userAddress.isDefault,
      createdAt: userAddress.createdAt,
      updatedAt: userAddress.updatedAt,
    }
  }
}
