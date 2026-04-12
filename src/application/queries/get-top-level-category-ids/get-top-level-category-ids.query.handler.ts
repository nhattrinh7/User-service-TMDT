import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import type { IRoleCategoryRepository } from '~/domain/repositories/role-category.repository.interface'
import { ROLE_CATEGORY_REPOSITORY } from '~/domain/repositories/role-category.repository.interface'
import { Inject } from '@nestjs/common'
import { GetTopLevelCategoryIdsQuery } from '~/application/queries/get-top-level-category-ids/get-top-level-category-ids.query'

@QueryHandler(GetTopLevelCategoryIdsQuery)
export class GetTopLevelCategoryIdsHandler
  implements IQueryHandler<GetTopLevelCategoryIdsQuery, string[]>
{
  constructor(
    @Inject(ROLE_CATEGORY_REPOSITORY)
    private readonly roleCategoryRepository: IRoleCategoryRepository,
  ) {}

  async execute(query: GetTopLevelCategoryIdsQuery): Promise<string[]> {
    const { roleId } = query

    return await this.roleCategoryRepository.findTopLevelCategoryIdsByRoleId(roleId)
  }
}
