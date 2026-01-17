import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DeleteAddressCommand } from '~/application/commands/delete-address/delete-address.command'
import { Inject, NotFoundException } from '@nestjs/common'
import { ADDRESS_REPOSITORY, type IAddressRepository } from '~/domain/repositories/address.repository.interface'

@CommandHandler(DeleteAddressCommand)
export class DeleteAddressHandler implements ICommandHandler<DeleteAddressCommand, void> {
  constructor(
    @Inject(ADDRESS_REPOSITORY)
    private readonly addressRepository: IAddressRepository,
  ) {}

  async execute(command: DeleteAddressCommand) {
    const { id } = command

    // Check xem có address này không
    const address = await this.addressRepository.findById(id)
    if (!address) throw new NotFoundException('This address is not exist')

    // Xóa address
    await this.addressRepository.deleteAddress(id)
  }
}
