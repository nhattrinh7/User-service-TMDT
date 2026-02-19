import { IQuery } from '@nestjs/cqrs'

export class GetUsersInfoQuery implements IQuery {
  constructor(
    public readonly userIds: string[],
  ) {}
}
