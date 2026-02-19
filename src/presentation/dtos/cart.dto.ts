import { createZodDto } from 'nestjs-zod'
import z from 'zod'

export const CartSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  productId: z.uuid(),
  productVariantId: z.uuid().nullable(),
  shopId: z.uuid(),
  productName: z.string(),
  productImage: z.string().nullable(),
  variantSku: z.string().nullable(),
  price: z.number(),
  quantity: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export class CartDto extends createZodDto(CartSchema) {}

export const AddToCartBodySchema = z.object({
  productVariantId: z.uuid(),
  quantity: z.number(),
})
export class AddToCartBodyDto extends createZodDto(AddToCartBodySchema) {}

export const DeleteCartItemsBodySchema = z.object({
  productVariantIds: z.array(z.uuid()),
})
export class DeleteCartItemsBodyDto extends createZodDto(DeleteCartItemsBodySchema) {}