import { Address } from '~/domain/entities/address.entity'

export interface IAddressRepository {
  getAddressesByUserId(userId: string): Promise<Address[] | null>
  getDefaultAddressByUserId(userId: string): Promise<Address | null>
  addAddress(address: Address): Promise<Address | null>
  findById(id: string): Promise<Address | null>
  deleteAddress(id: string): Promise<void>
  update(address: Address, tx?: any): Promise<Address>
  findDefaultByUserId(userId: string): Promise<Address | null>
  findByIds(ids: string[]): Promise<Address[]>
}
export const ADDRESS_REPOSITORY = Symbol('IAddressRepository')