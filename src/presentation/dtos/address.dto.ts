import { createZodDto } from 'nestjs-zod'
import z from 'zod'

export const AddressSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  recipientName: z.string(),
  recipientPhoneNumber: z.string(),
  province: z.string(),
  ward: z.string(),
  detail: z.string(),
  isDefault: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export class AddressDto extends createZodDto(AddressSchema) {}

export const addAddressBodySchema = AddressSchema.pick({
  recipientName: true,
  recipientPhoneNumber: true,
  province: true,
  ward: true,
  detail: true,
  isDefault: true,
})
export class AddAddressBodyDto extends createZodDto(addAddressBodySchema) {}
export class UpdateAddressBodyDto extends createZodDto(addAddressBodySchema) {}
