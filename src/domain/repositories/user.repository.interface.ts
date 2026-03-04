import { User } from '~/domain/entities/user.entity'
import { UpdateProfileBodyDto } from '~/presentation/dtos/user.dto'
import { PaginatedResult } from '~/domain/interfaces/user.interface'
import { CartItem } from '~/domain/entities/cart-item.entity'

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  save(user: User): Promise<User>
  update(userId: string, data: UpdateProfileBodyDto): Promise<User>
  findByUsername(username: string): Promise<User | null>
  getUsersPaginated(page: number, limit: number, search?: string, status?: string): Promise<PaginatedResult<User>>
  updateStatus(userId: string, status: string): Promise<User>
  findByIds(ids: string[]): Promise<User[]>
  countCartItems(userId: string): Promise<number>
  getCartItems(userId: string): Promise<any[]>
  findCartItemByUserAndVariant(userId: string, productVariantId: string): Promise<any>
  createCartItem(cartItem: CartItem): Promise<CartItem>
  updateCartItemQuantity(userId: string, productVariantId: string, quantity: number): Promise<void>
  deleteCartItems(userId: string, productVariantIds: string[]): Promise<number>
}
export const USER_REPOSITORY = Symbol('IUserRepository')