import { ICommand } from '@nestjs/cqrs'
import { UpdateAddressBodyDto } from '~/presentation/dtos/address.dto'

export class UpdateAddressCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly body: UpdateAddressBodyDto,
  ) {}
}
