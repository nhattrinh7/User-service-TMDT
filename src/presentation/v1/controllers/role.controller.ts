import {
  Controller,
  Get,
  Param,
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { GetTopLevelCategoryIdsQuery } from '~/application/queries/get-top-level-category-ids/get-top-level-category-ids.query'

@Controller('v1/roles')
export class RoleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('/:id/category-ids/top-level')
  async getTopLevelCategoryIds(
    @Param('id') roleId: string
  ): Promise<any> {
    const result = await this.queryBus.execute(new GetTopLevelCategoryIdsQuery(roleId))
    return { message: 'Get top level categoryIds successful', data: result }
  }
}
