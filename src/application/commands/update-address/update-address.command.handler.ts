import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpdateAddressCommand } from '~/application/commands/update-address/update-address.command'
import { Inject, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { AddressDto } from '~/presentation/dtos/address.dto'
import {
  ADDRESS_REPOSITORY,
  type IAddressRepository,
} from '~/domain/repositories/address.repository.interface'
import { AddressMapper } from '~/application/mappers/address.mapper'

@CommandHandler(UpdateAddressCommand)
export class UpdateAddressHandler implements ICommandHandler<UpdateAddressCommand, AddressDto> {
  constructor(
    @Inject(ADDRESS_REPOSITORY)
    private readonly addressRepository: IAddressRepository,
  ) {}

  async execute(command: UpdateAddressCommand) {
    const { id, body } = command

    // Check xem có address này không
    const address = await this.addressRepository.findById(id)
    if (!address) throw new NotFoundException('This address is not exist')

    // Cập nhật Address
    address.updateInfo({
      recipientName: body.recipientName,
      recipientPhoneNumber: body.recipientPhoneNumber,
      province: body.province,
      ward: body.ward,
      detail: body.detail,
      isDefault: body.isDefault,
    })

    const updatedAddress = await this.addressRepository.update(address)
    if (!updatedAddress) throw new InternalServerErrorException('Failed to update address')

    return AddressMapper.toAddressResponse(updatedAddress)
  }
}
