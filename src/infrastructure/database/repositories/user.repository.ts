import { Injectable } from '@nestjs/common'
import { PrismaService } from '~/infrastructure/database/prisma/prisma.service'
import { User } from '~/domain/entities/user.entity'
import { UserMapper } from '~/infrastructure/database/mappers/user.mapper'
import { IUserRepository } from '~/domain/repositories/user.repository.interface'
import { UpdateProfileBodyDto } from '~/presentation/dtos/user.dto'
import { PaginatedResult } from '~/domain/interfaces/user.interface'
import { CartItem } from '~/domain/entities/cart-item.entity'

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({ where: { email } })
    if (!userData) return null

    const user = UserMapper.toDomain(userData) // Map sang Entity trước, vì merge là merge cái dạng Entity ấy
    return user
  }

  async findById(id: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({ where: { id } })
    if (!userData) return null

    const user = UserMapper.toDomain(userData)
    return user
  }

  async save(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user)
    
    const saved = await this.prisma.user.upsert({
      where: { id: user.id },
      update: data,
      create: data,
    })

    return UserMapper.toDomain(saved)
  }

  async update(userId: string, data: UpdateProfileBodyDto): Promise<User> {
    const saved = await this.prisma.user.update({
      where: { id: userId },
      data: {
        username: data.username,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        dob: data.dob,
        gender: data.gender,
      }
    })
    return UserMapper.toDomain(saved)
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { username }
    })

    if (!user) return null

    return UserMapper.toDomain(user)
  }

  async getUsersPaginated(page: number, limit: number, search?: string, status?: string): Promise<PaginatedResult<User>> {
    const skip = (page - 1) * limit

    const whereClause: any = {}

    // Nếu có search thì thêm điều kiện tìm kiếm
    if (search) {
      whereClause.OR = [
        // contains: tìm kiếm chuỗi con, tức tìm các bản ghi có chứa từ khóa search trong username, email, fullName
        // insensitive: tìm kiếm không phân biệt hoa thường
        { username: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
        { fullName: { contains: search, mode: 'insensitive' as const } },
      ]
    }

    // Nếu có status thì lọc theo status
    if (status) {
      whereClause.status = status
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: whereClause }),
    ])

    return {
      data: users.map((user) => UserMapper.toDomain(user)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async updateStatus(userId: string, status: string): Promise<User> {
    const saved = await this.prisma.user.update({
      where: { id: userId },
      data: { status: status as any },
    })
    return UserMapper.toDomain(saved)
  }

  async updateRole(userId: string, roleId: string): Promise<User> {
    const saved = await this.prisma.user.update({
      where: { id: userId },
      data: { roleId },
    })
    return UserMapper.toDomain(saved)
  }

  async findRoleIdByName(roleName: string): Promise<string | null> {
    const role = await this.prisma.role.findUnique({
      where: { name: roleName }
    })
    return role?.id ?? null
  }

  async findByIds(ids: string[]): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { id: { in: ids } }
    })
    return users.map((user) => UserMapper.toDomain(user))
  }

  async countCartItems(userId: string): Promise<number> {
    const count = await this.prisma.cartItem.count({
      where: { userId }
    })
    return count
  }

  async getCartItems(userId: string): Promise<any[]> {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
    return cartItems
  }

  async findCartItemByUserAndVariant(userId: string, productVariantId: string): Promise<any> {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: { 
        userId,
        productVariantId 
      }
    })
    return cartItem
  }

  async createCartItem(cartItem: CartItem): Promise<CartItem> {
    await this.prisma.cartItem.create({
      data: {
        id: cartItem.id,
        userId: cartItem.userId,
        productId: cartItem.productId,
        productVariantId: cartItem.productVariantId,
        shopId: cartItem.shopId,
        productName: cartItem.productName,
        productImage: cartItem.productImage,
        variantSku: cartItem.variantSku,
        price: cartItem.price,
        quantity: cartItem.quantity,
        createdAt: cartItem.createdAt,
        updatedAt: cartItem.updatedAt
      }
    })
    return cartItem
  }

  async updateCartItemQuantity(userId: string, productVariantId: string, quantity: number): Promise<void> {
    await this.prisma.cartItem.updateMany({
      where: {
        userId,
        productVariantId
      },
      data: {
        quantity,
        updatedAt: new Date()
      }
    })
  }

  async deleteCartItems(userId: string, productVariantIds: string[]): Promise<number> {
    const result = await this.prisma.cartItem.deleteMany({
      where: {
        userId,
        productVariantId: { in: productVariantIds }
      }
    })
    return result.count
  }
}
