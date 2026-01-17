import { PhoneNumber } from '~/domain/value-objects/phone-number.vo'
import { ICreateAddressProps } from '~/domain/interfaces/address.interface'
import { v4 as uuidv4 } from 'uuid'

export class Address {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public recipientName: string,
    public recipientPhoneNumber: PhoneNumber,
    public province: string,
    public ward: string,
    public detail: string,
    public isDefault: boolean = false,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(props: ICreateAddressProps): Address {
    const address = new Address(
      uuidv4(),
      props.userId,
      props.recipientName,
      PhoneNumber.create(props.recipientPhoneNumber),
      props.province,
      props.ward,
      props.detail,
      props.isDefault || false,
      new Date(),
      new Date(),
    )
    return address
  }

  updateInfo(props: {
    recipientName?: string
    recipientPhoneNumber?: string
    province?: string
    ward?: string
    detail?: string
    isDefault?: boolean
  }): void {
    // Dùng '!== undefined' vì nếu ko dùng sẽ bỏ qua '', 0, và một số giá trị khác
    if (props.recipientName !== undefined) this.recipientName = props.recipientName
    if (props.recipientPhoneNumber !== undefined) this.recipientPhoneNumber = PhoneNumber.create(props.recipientPhoneNumber)
    if (props.province !== undefined) this.province = props.province
    if (props.ward !== undefined) this.ward = props.ward
    if (props.detail !== undefined) this.detail = props.detail
    if (props.isDefault !== undefined) this.isDefault = props.isDefault
  }

  setAsDefault(): void {
    this.isDefault = true
  }

  unsetDefault(): void {
    this.isDefault = false
  }
}
