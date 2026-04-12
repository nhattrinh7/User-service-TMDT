import { v4 as uuidv4 } from 'uuid'

export class CartItem {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly productId: string,
    public readonly productVariantId: string,
    public readonly shopId: string,
    public readonly productName: string,
    public readonly productImage: string | null,
    public readonly variantSku: string | null,
    public readonly price: number,
    public readonly quantity: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: {
    userId: string
    variantInfo: {
      id: string
      productId: string
      shopId: string
      name: string
      image: string | null
      sku: string | null
      price: number
    }
    quantity: number
  }): CartItem {
    return new CartItem(
      uuidv4(),
      data.userId,
      data.variantInfo.productId,
      data.variantInfo.id,
      data.variantInfo.shopId,
      data.variantInfo.name,
      data.variantInfo.image,
      data.variantInfo.sku,
      data.variantInfo.price,
      data.quantity,
      new Date(),
      new Date(),
    )
  }
}
