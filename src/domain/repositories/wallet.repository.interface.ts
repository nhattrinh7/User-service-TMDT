export interface IWalletRepository {
  findByUserId(userId: string, tx?: any): Promise<{
    userId: string
    balance: number
  } | null>

  deductBalance(userId: string, amount: number, tx?: any): Promise<void>

  addBalance(userId: string, amount: number): Promise<void>

  refundBalance(userId: string, amount: number): Promise<void>
}
export const WALLET_REPOSITORY = Symbol('IWalletRepository')
