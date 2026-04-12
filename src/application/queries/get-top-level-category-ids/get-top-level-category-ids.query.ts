import { IQuery } from '@nestjs/cqrs'

export class GetTopLevelCategoryIdsQuery implements IQuery {
  constructor(public readonly roleId: string) {}
}
