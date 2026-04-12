import { IQuery } from '@nestjs/cqrs'

export class GetOwnerEmailQuery implements IQuery {
  constructor(public readonly ownerId: string) {}
}
