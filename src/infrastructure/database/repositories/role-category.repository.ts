import { Injectable } from '@nestjs/common'
import { PrismaService } from '~/infrastructure/database/prisma/prisma.service'
import { RoleCategory } from '~/domain/entities/role-category.entity'
import { RoleCategoryMapper } from '~/infrastructure/database/mappers/role-category.mapper'
import { IRoleCategoryRepository } from '~/domain/repositories/role-category.repository.interface'

@Injectable()
export class RoleCategoryRepository implements IRoleCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(roleCategory: RoleCategory): Promise<RoleCategory> {
    const data = RoleCategoryMapper.toPersistence(roleCategory)

    const saved = await this.prisma.roleCategory.create({
      data,
    })

    return RoleCategoryMapper.toDomain(saved)
  }

  async findByRoleAndCategory(roleId: string, categoryId: string): Promise<RoleCategory | null> {
    const roleCategory = await this.prisma.roleCategory.findUnique({
      where: {
        roleId_categoryId: {
          roleId,
          categoryId,
        },
      },
    })

    if (!roleCategory) return null

    return RoleCategoryMapper.toDomain(roleCategory)
  }

  async findByRoleId(roleId: string): Promise<RoleCategory[]> {
    const roleCategories = await this.prisma.roleCategory.findMany({
      where: { roleId },
    })

    return roleCategories.map((rc) => RoleCategoryMapper.toDomain(rc))
  }

  async findTopLevelCategoryIdsByRoleId(roleId: string): Promise<string[]> {
    const roleCategories = await this.prisma.roleCategory.findMany({
      where: { 
        roleId,
        level: 1 
      },
      select: { categoryId: true },
    })

    return roleCategories.map((rc) => rc.categoryId)
  }

  async findLeafCategoryIdsByRoleId(roleId: string): Promise<string[]> {
    const roleCategories = await this.prisma.roleCategory.findMany({
      where: { 
        roleId,
        isLeaf: true 
      },
      select: { categoryId: true },
    })

    return roleCategories.map((rc) => rc.categoryId)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.roleCategory.delete({
      where: { id },
    })
  }
}
