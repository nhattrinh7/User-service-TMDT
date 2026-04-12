import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { SagaGetAddressCommand } from './saga-get-address.command'
import type { IAddressRepository } from '~/domain/repositories/address.repository.interface'
import { ADDRESS_REPOSITORY } from '~/domain/repositories/address.repository.interface'

interface GetAddressResult {
  success: boolean
  address?: {
    id: string
    recipientName: string
    recipientPhoneNumber: string
    province: string
    district?: string
    ward: string
    detail: string
  }
  error?: string
}

@CommandHandler(SagaGetAddressCommand)
export class SagaGetAddressHandler
  implements ICommandHandler<SagaGetAddressCommand, GetAddressResult>
{
  constructor(
    @Inject(ADDRESS_REPOSITORY)
    private readonly addressRepository: IAddressRepository,
  ) {}

  async execute(command: SagaGetAddressCommand): Promise<GetAddressResult> {
    const { userId, addressId } = command

    const address = await this.addressRepository.findByUserIdAndAddressId(userId, addressId)

    if (!address) {
      return { success: false, error: 'Địa chỉ không tồn tại' }
    }

    return {
      success: true,
      address: {
        id: address.id,
        recipientName: address.recipientName,
        recipientPhoneNumber: address.recipientPhoneNumber.value,
        province: address.province,
        ward: address.ward,
        detail: address.detail,
      },
    }
  }
}
