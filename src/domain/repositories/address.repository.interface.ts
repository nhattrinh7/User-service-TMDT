import { Address } from '~/domain/entities/address.entity'

export interface IAddressRepository {
  getAddressesByUserId(userId: string): Promise<Address[] | null>
  getDefaultAddressByUserId(userId: string): Promise<Address | null>
  addAddress(address: Address): Promise<Address | null>
  findById(id: string): Promise<Address | null>
  deleteAddress(id: string): Promise<void>
  update(address: Address): Promise<Address>
  findDefaultByUserId(userId: string): Promise<Address | null>
}
export const ADDRESS_REPOSITORY = Symbol('IAddressRepository')