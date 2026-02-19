import { IQuery } from '@nestjs/cqrs'

export class CountCartItemsQuery implements IQuery {
  constructor(
    public readonly userId: string,
  ) {}
}
