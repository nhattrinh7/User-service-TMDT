export interface ICreateAddressProps {
  userId: string
  recipientName: string
  recipientPhoneNumber: string
  province: string
  ward: string
  detail: string
  fullAddress?: string
  isDefault?: boolean
}
