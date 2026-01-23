import { RoleCategory } from '~/domain/entities/role-category.entity'

export interface IRoleCategoryRepository {
  create(roleCategory: RoleCategory): Promise<RoleCategory>
  findByRoleAndCategory(roleId: string, categoryId: string): Promise<RoleCategory | null>
  findByRoleId(roleId: string): Promise<RoleCategory[]>
  findTopLevelCategoryIdsByRoleId(roleId: string): Promise<string[]>
  findLeafCategoryIdsByRoleId(roleId: string): Promise<string[]>
  delete(id: string): Promise<void>
}

export const ROLE_CATEGORY_REPOSITORY = Symbol('IRoleCategoryRepository')
