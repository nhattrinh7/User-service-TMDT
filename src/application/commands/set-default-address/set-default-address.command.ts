import { ICommand } from '@nestjs/cqrs'

export class SetDefaultAddressCommand implements ICommand {
  constructor(public readonly id: string) {}
}
