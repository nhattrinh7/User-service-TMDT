import { ICommand } from '@nestjs/cqrs'
import { AddAddressBodyDto } from '~/presentation/dtos/address.dto'

export class AddAddressCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly body: AddAddressBodyDto,
  ) {}
}
