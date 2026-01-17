import { User } from '~/domain/entities/user.entity'
import { UpdateProfileBodyDto } from '~/presentation/dtos/user.dto'
import { PaginatedResult } from '~/domain/interfaces/user.interface'

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  save(user: User): Promise<User>
  update(userId: string, data: UpdateProfileBodyDto): Promise<User>
  findByUsername(username: string): Promise<User | null>
  getUsersPaginated(page: number, limit: number, search?: string, status?: string): Promise<PaginatedResult<User>>
  updateStatus(userId: string, status: string): Promise<User>
}
export const USER_REPOSITORY = Symbol('IUserRepository')