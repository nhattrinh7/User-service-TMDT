import { Controller, Post, Body, Get } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { CreateRoleCategoryCommand } from '~/application/commands/create-role-category/create-role-category.command'
import { CreateRoleCategoryBodyDto } from '~/presentation/dtos/role-category.dto'

@Controller('v1/role-categories')
export class RoleCategoryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('/')
  async createRoleCategory(@Body() body: CreateRoleCategoryBodyDto): Promise<any> {
    const result = await this.commandBus.execute(new CreateRoleCategoryCommand(body))
    return { message: 'Create role category successful', data: result }
  }
}
