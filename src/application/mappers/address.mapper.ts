import { Address } from '~/domain/entities/address.entity'
import { AddressDto } from '~/presentation/dtos/address.dto'

export class AddressMapper {
  static toAddressResponse(address: Address): AddressDto {
    return {
      id: address.id,
      userId: address.userId,
      recipientName: address.recipientName,
      recipientPhoneNumber: address.recipientPhoneNumber.value,
      province: address.province,
      ward: address.ward,
      detail: address.detail,
      isDefault: address.isDefault,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    }
  }

  // For array of addresses
  static toAddressesResponse(addresses: Address[]): AddressDto[] {
    return addresses.map(address => this.toAddressResponse(address))
  }
}
