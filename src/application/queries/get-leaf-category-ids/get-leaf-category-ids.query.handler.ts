import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import type { IRoleCategoryRepository } from '~/domain/repositories/role-category.repository.interface'
import { ROLE_CATEGORY_REPOSITORY } from '~/domain/repositories/role-category.repository.interface'
import { Inject } from '@nestjs/common'
import { GetLeafCategoryIdsQuery } from '~/application/queries/get-leaf-category-ids/get-leaf-category-ids.query'

@QueryHandler(GetLeafCategoryIdsQuery)
export class GetLeafCategoryIdsHandler implements IQueryHandler<GetLeafCategoryIdsQuery, string[]> {
  constructor(
    @Inject(ROLE_CATEGORY_REPOSITORY)
    private readonly roleCategoryRepository: IRoleCategoryRepository,
  ) {}

  async execute(query: GetLeafCategoryIdsQuery): Promise<string[]> {
    const { roleId } = query

    return await this.roleCategoryRepository.findLeafCategoryIdsByRoleId(roleId)
  }
}
