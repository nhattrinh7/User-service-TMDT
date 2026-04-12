import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject, ConflictException } from '@nestjs/common'
import { CreateRoleCategoryCommand } from '~/application/commands/create-role-category/create-role-category.command'
import type { IRoleCategoryRepository } from '~/domain/repositories/role-category.repository.interface'
import { ROLE_CATEGORY_REPOSITORY } from '~/domain/repositories/role-category.repository.interface'
import { RoleCategory } from '~/domain/entities/role-category.entity'

@CommandHandler(CreateRoleCategoryCommand)
export class CreateRoleCategoryHandler
  implements ICommandHandler<CreateRoleCategoryCommand, RoleCategory>
{
  constructor(
    @Inject(ROLE_CATEGORY_REPOSITORY)
    private readonly roleCategoryRepository: IRoleCategoryRepository,
  ) {}

  async execute(command: CreateRoleCategoryCommand): Promise<RoleCategory> {
    const { roleId, categoryId, level, isLeaf } = command.body

    const existing = await this.roleCategoryRepository.findByRoleAndCategory(roleId, categoryId)
    if (existing) throw new ConflictException('Role category already exists')

    const roleCategory = RoleCategory.create({ roleId, categoryId, level, isLeaf })

    return await this.roleCategoryRepository.create(roleCategory)
  }
}
