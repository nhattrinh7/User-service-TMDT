import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { Gender, UserStatus } from '~/domain/enums/user.enum'

export const UserSchema = z.object({
  id: z.uuid(),
  username: z.string(),
  email: z.email(),
  roleId: z.uuid(),
  fullName: z.string().min(2),
  phoneNumber: z.string().min(10).max(11),
  dob: z.coerce.date(),
  gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]),
  avatar: z.url().nullable(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.BANNED]),
  emailVerified: z.boolean(),
  require2FA: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export class UserDto extends createZodDto(UserSchema) {}

export class GetProfileResponseDto extends createZodDto(UserSchema) {}
export class UploadAvatarResponseDto extends createZodDto(UserSchema) {}

export const updateProfileBodySchema = z.object({
  username: z.string(),
  fullName: z.string(),
  phoneNumber: z.string(),
  dob: z.string(),
  gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]),
})
export class UpdateProfileBodyDto extends createZodDto(updateProfileBodySchema) {}
export class UpdateProfileResponseDto extends createZodDto(UserSchema) {}

export const changePasswordBodyDto = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
})
export type ChangePasswordBodyDto = z.infer<typeof changePasswordBodyDto>

export const getUsersPaginatedQueryDto = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)) // chuyển kiểu dữ liệu sang int, nếu không có giá trị thì mặc định là 1
    .pipe(z.number().int().positive()), // xác thực lại sau khi chuyển kiểu dữ liệu
  
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)) // chuyển kiểu dữ liệu sang int, nếu không có giá trị thì mặc định là 10
    .pipe(z.number().int().positive().max(10)),
  
  search: z
    .string()
    .optional()
    .transform((val) => val || undefined), // "laptop" → "laptop", "" → undefined, undefined → undefined
    // lí do mà "" → undefined là vì nếu ko muốn search thì đã ko cần truyền search vào url, đã search thì phải có giá trị
    // đằng này lại truyền search="" để làm quái gì, coi như ko truyền search vào cho rồi
  
  status: z.enum([UserStatus.ACTIVE, UserStatus.BANNED]).optional()
})
export class GetUsersPaginatedQueryDto extends createZodDto(getUsersPaginatedQueryDto) {}
