import { Controller, Param, Get, Query, Patch } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { GetUsersPaginatedQuery } from '~/application/queries/get-users-paginated/get-users-paginated.query'
import { GetUsersPaginatedQueryDto } from '~/presentation/dtos/user.dto'
import { BanUserCommand } from '~/application/commands/ban-user/ban-user.command'
import { UnbanUserCommand } from '~/application/commands/unban-user/unban-user.command'

@Controller('v1/admin/users')
export class AdminController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('/')
  async getUsersPaginated(@Query() query: GetUsersPaginatedQueryDto): Promise<any> {
    const result = await this.queryBus.execute(
      new GetUsersPaginatedQuery(query.page, query.limit, query.search, query.status),
    )

    return { message: 'Get users paginated successful', data: result }
  }

  @Patch('/:id/ban')
  async banUser(@Param('id') id: string): Promise<any> {
    await this.commandBus.execute(new BanUserCommand(id))
    return { message: 'Ban user successful' }
  }

  @Patch('/:id/unban')
  async unbanUser(@Param('id') id: string): Promise<any> {
    await this.commandBus.execute(new UnbanUserCommand(id))
    return { message: 'Unban user successful' }
  }
}
