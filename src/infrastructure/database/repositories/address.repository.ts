import { Injectable } from '@nestjs/common'
import { PrismaService } from '~/infrastructure/database/prisma/prisma.service'
import { Address } from '~/domain/entities/address.entity'
import { AddressMapper } from '~/infrastructure/database/mappers/address.mapper'
import { IAddressRepository } from '~/domain/repositories/address.repository.interface'

@Injectable()
export class AddressRepository implements IAddressRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAddressesByUserId(userId: string): Promise<Address[]> {
    const addresses = await this.prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' }, // Địa chỉ mặc định lên đầu
        { createdAt: 'desc' }  // Mới nhất tiếp theo 
      ]
    })

    return AddressMapper.toDomain(addresses)
  }

  async getDefaultAddressByUserId(userId: string): Promise<Address | null> {
    const address = await this.prisma.address.findFirst({
      where: {
        userId,
        isDefault: true,
      },
    })

    if (!address) return null
    return AddressMapper.toSingleDomainAddress(address)
  }

  async addAddress(address: Address): Promise<Address | null> {
    const addressToAdd = AddressMapper.toPersistence(address)

    const newAddress = await this.prisma.address.create({
      data: addressToAdd
    })

    return AddressMapper.toSingleDomainAddress(newAddress)
  }

  async findById(id: string): Promise<Address | null> {
    const address = await this.prisma.address.findFirst({
      where: { id: id }
    })
    return AddressMapper.toSingleDomainAddress(address)
  }

  async deleteAddress(id: string): Promise<void> {
    await this.prisma.address.delete({
      where: { id: id }
    })
  }

  async update(address: Address): Promise<Address> {
    const prismaAddress = await this.prisma.address.update({
      where: { id: address.id },
      data: {
        recipientName: address.recipientName,
        recipientPhoneNumber: address.recipientPhoneNumber.value,
        province: address.province,
        ward: address.ward,
        detail: address.detail,
        isDefault: address.isDefault,
        updatedAt: address.updatedAt
      }
    })

    return AddressMapper.toSingleDomainAddress(prismaAddress)!
  }

  async findDefaultByUserId(userId: string): Promise<Address | null> {
  const address = await this.prisma.address.findFirst({
    where: { 
      userId,
      isDefault: true 
    }
  })
  return AddressMapper.toSingleDomainAddress(address)
}
}
