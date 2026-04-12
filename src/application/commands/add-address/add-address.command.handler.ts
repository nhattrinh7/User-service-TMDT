import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AddAddressCommand } from '~/application/commands/add-address/add-address.command'
import { Inject, InternalServerErrorException } from '@nestjs/common'
import { AddressDto } from '~/presentation/dtos/address.dto'
import {
  ADDRESS_REPOSITORY,
  type IAddressRepository,
} from '~/domain/repositories/address.repository.interface'
import { Address } from '~/domain/entities/address.entity'
import { AddressMapper } from '~/application/mappers/address.mapper'

@CommandHandler(AddAddressCommand)
export class AddAddressHandler implements ICommandHandler<AddAddressCommand, AddressDto> {
  constructor(
    @Inject(ADDRESS_REPOSITORY)
    private readonly addressRepository: IAddressRepository,
  ) {}

  async execute(command: AddAddressCommand) {
    const { userId, body } = command

    // Tạo mới Address
    const address = Address.create({
      userId,
      recipientName: body.recipientName,
      recipientPhoneNumber: body.recipientPhoneNumber,
      province: body.province,
      ward: body.ward,
      detail: body.detail,
      isDefault: body.isDefault,
    })

    const savedAddress = await this.addressRepository.addAddress(address)

    if (!savedAddress) throw new InternalServerErrorException('Failed to add address')

    return AddressMapper.toAddressResponse(savedAddress)
  }
}
