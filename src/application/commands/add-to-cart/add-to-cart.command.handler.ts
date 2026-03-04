import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject, NotFoundException } from '@nestjs/common'
import { CartItem } from '~/domain/entities/cart-item.entity'
import type { IUserRepository } from '~/domain/repositories/user.repository.interface'
import { USER_REPOSITORY } from '~/domain/repositories/user.repository.interface'
import { AddToCartCommand } from './add-to-cart.command'
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

type AddToCartResponse = 
  | { productVariantId: string; quantity: number }
  | CartGroupedByShop

@CommandHandler(AddToCartCommand)
export class AddToCartHandler implements ICommandHandler<AddToCartCommand, AddToCartResponse> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(MESSAGE_PUBLISHER)
    private readonly messagePublisher: IMessagePublisher,
  ) {}

  async execute(command: AddToCartCommand): Promise<AddToCartResponse> {
    const { userId, productVariantId, quantity } = command

    // Kiểm tra user có tồn tại không
    const user = await this.userRepository.findById(userId)
    if (!user) throw new NotFoundException(`User doesn't exist`)

    // Tìm CartItem theo userId và productVariantId
    const existingCartItem = await this.userRepository.findCartItemByUserAndVariant(userId, productVariantId)

    // Nếu đã có item trong giỏ hàng → cập nhật quantity trong DB
    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity

      await this.userRepository.updateCartItemQuantity(userId, productVariantId, newQuantity)

      return {
        productVariantId,
        quantity: newQuantity
      }
    }

    // Nếu chưa có, cần lấy thông tin variant từ catalog-service
    interface VariantInfo {
      id: string
      productId: string
      sku: string | null
      price: number
      name: string
      image: string | null
      shopId: string
    }

    const variantInfo = await this.messagePublisher.sendToCatalogService<
      { productVariantId: string },
      VariantInfo
    >('get.variant.info', { productVariantId })

    // Gọi shop-service để lấy thông tin shop
    const shopsInfo = await this.messagePublisher.sendToShopService<
      { shopIds: string[] },
      ShopInfo[]
    >('get.shop.simple_data', { shopIds: [variantInfo.shopId] })

    const shopInfo = shopsInfo[0]

    // Create new CartItem
    const cartItem = CartItem.create({
        userId,
        variantInfo,
        quantity,
    })

    await this.userRepository.createCartItem(cartItem)

    // Trả về thông tin shop và variant theo format giống getCart
    const result: CartGroupedByShop = {
      id: shopInfo.id,
      name: shopInfo.name,
      logo: shopInfo.logo,
      items: [
        {
          id: cartItem.id, 
          productId: variantInfo.productId,
          productVariantId: variantInfo.id,
          name: variantInfo.name,
          price: variantInfo.price,
          quantity: quantity,
          image: variantInfo.image,
          sku: variantInfo.sku,
        }
      ]
    }

    return result
  }
}
