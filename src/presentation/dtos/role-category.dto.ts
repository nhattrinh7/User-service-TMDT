import { createZodDto } from 'nestjs-zod'
import z from 'zod'

export const RoleCategorySchema = z.object({
  id: z.uuid(),
  roleId: z.uuid(),
  categoryId: z.uuid(),
  level: z.number().int(),
  isLeaf: z.boolean().default(false),
})
export class RoleCategoryDto extends createZodDto(RoleCategorySchema) {}

export const CreateRoleCategoryBodySchema = RoleCategorySchema.pick({
  roleId: true,
  categoryId: true,
}).extend({
  level: z.number().int(),
  isLeaf: z.boolean().default(false),
})
export class CreateRoleCategoryBodyDto extends createZodDto(CreateRoleCategoryBodySchema) {}