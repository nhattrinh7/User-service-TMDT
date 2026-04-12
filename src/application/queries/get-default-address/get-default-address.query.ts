import { IQuery } from '@nestjs/cqrs'

export class GetDefaultAddressQuery implements IQuery {
  constructor(public readonly userId: string) {}
}
