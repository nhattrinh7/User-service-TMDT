import { RoleCategory as PrismaRoleCategory } from '@prisma/client'
import { RoleCategory } from '~/domain/entities/role-category.entity'

export class RoleCategoryMapper {
  static toDomain(prismaRoleCategory: PrismaRoleCategory): RoleCategory {
    return new RoleCategory(
      prismaRoleCategory.id,
      prismaRoleCategory.roleId,
      prismaRoleCategory.categoryId,
      prismaRoleCategory.level,
      prismaRoleCategory.isLeaf,
    )
  }

  static toPersistence(roleCategory: RoleCategory) {
    return {
      id: roleCategory.id,
      roleId: roleCategory.roleId,
      categoryId: roleCategory.categoryId,
      level: roleCategory.level,
      isLeaf: roleCategory.isLeaf,
    }
  }
}
