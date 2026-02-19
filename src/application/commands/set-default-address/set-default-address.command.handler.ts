import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { SetDefaultAddressCommand } from '~/application/commands/set-default-address/set-default-address.command'
import { Inject, NotFoundException } from '@nestjs/common'
import { ADDRESS_REPOSITORY, type IAddressRepository } from '~/domain/repositories/address.repository.interface'
import { PrismaService } from '~/infrastructure/database/prisma/prisma.service'

@CommandHandler(SetDefaultAddressCommand)
export class SetDefaultAddressHandler implements ICommandHandler<SetDefaultAddressCommand, void> {
  constructor(
    @Inject(ADDRESS_REPOSITORY)
    private readonly addressRepository: IAddressRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(command: SetDefaultAddressCommand) {
    const { id } = command

    // Check xem có address này không
    const address = await this.addressRepository.findById(id)
    if (!address) throw new NotFoundException('This address is not exist')

    // Nếu đã là default rồi thì thôi
    if (address.isDefault) return
    
    // Tìm address đang là default của user này
    const currentDefaultAddress = await this.addressRepository.findDefaultByUserId(address.userId)

    // Wrap DB writes trong transaction
    await this.prismaService.transaction(async (tx) => {
      // Unset default cũ
      if (currentDefaultAddress) {
        currentDefaultAddress.unsetDefault()
        await this.addressRepository.update(currentDefaultAddress, tx)
      }

      // Set address này làm default
      address.setAsDefault()
      await this.addressRepository.update(address, tx)
    })
  }
}
