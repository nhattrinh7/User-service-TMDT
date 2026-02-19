import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import type { IUserRepository } from '~/domain/repositories/user.repository.interface'
import { USER_REPOSITORY } from '~/domain/repositories/user.repository.interface'
import { Inject, NotFoundException } from '@nestjs/common'
import { GetCartQuery } from '~/application/queries/get-cart/get-cart.query'
import type { IMessagePublisher } from '~/domain/contracts/message-publisher.interface'
import { MESSAGE_PUBLISHER } from '~/domain/contracts/message-publisher.interface'

interface CartItemInfo {
  id: string
  productId: string
  productVariantId: string
  name: string
  price: number
  quantity: number
  image: string | null
  sku: string | null
}

interface CartGroupedByShop {
  id: string
  name: string // shop name
  logo: string | null // shop logo
  items: CartItemInfo[]
}

interface ShopInfo {
  id: string
  name: string
  logo: string | null
  createdAt: Date
}

@QueryHandler(GetCartQuery)
export class GetCartHandler implements IQueryHandler<GetCartQuery, CartGroupedByShop[]> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(MESSAGE_PUBLISHER)
    private readonly messagePublisher: IMessagePublisher,
  ) {}

  async execute(query: GetCartQuery): Promise<CartGroupedByShop[]> {
    const { userId } = query

    // Kiểm tra user có tồn tại không
    const user = await this.userRepository.findById(userId)
    if (!user) throw new NotFoundException(`User doesn't exist`)

    // Lấy tất cả cart items của user
    const cartItems = await this.userRepository.getCartItems(userId)

    if (cartItems.length === 0) {
      return []
    }

    // Nhóm cart items theo shopId
    const groupedByShop = cartItems.reduce((acc, item) => {
      if (!acc[item.shopId]) {
        acc[item.shopId] = []
      }
      acc[item.shopId].push(item)
      return acc
    }, {} as Record<string, any[]>)

    const shopIds = Object.keys(groupedByShop)

    // Gọi shop-service để lấy thông tin các shop
    const shopsInfo = await this.messagePublisher.sendToShopService<
      { shopIds: string[] },
      ShopInfo[]
    >('get.shop.simple_data', { shopIds })

    // Map shop info với cart items
    const result: CartGroupedByShop[] = shopsInfo.map((shop) => ({
      id: shop.id,
      name: shop.name,
      logo: shop.logo,
      items: groupedByShop[shop.id].map((item) => ({
        id: item.id,
        productId: item.productId,
        productVariantId: item.productVariantId,
        name: item.productName,
        price: item.price,
        quantity: item.quantity,
        image: item.productImage,
        sku: item.variantSku,
      })),
    }))

    return result
  }
}
