import { AggregateRoot } from '@nestjs/cqrs'
import { Gender, UserStatus } from '~/domain/enums/user.enum'
import { PhoneNumber } from '~/domain/value-objects/phone-number.vo'
import { Email } from '~/domain/value-objects/email.vo'
import { FullName } from '~/domain/value-objects/full-name.vo'
import { OTP } from '~/domain/value-objects/otp.vo'
import { comparePassword, hashPassword } from '~/common/utils/bcrypt.util'

export class User extends AggregateRoot {
  constructor(
    public readonly id: string,
    public username: string,
    public email: Email,
    public roleId: string,
    private password: string,
    private passCode: string | null,
    public fullName: FullName,
    public phoneNumber: PhoneNumber,
    public dob: Date,
    public gender: Gender,
    public avatar: string | null,
    public status: UserStatus,
    public require2FA: boolean,
    public emailVerifyOtp: OTP | null,
    public emailVerified: boolean,
    private passwordResetOtp: OTP | null,
    private passCodeResetOtp: OTP | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {
    super()
  }

  async verifyPassword(plainPassword: string): Promise<boolean> {
    if (!plainPassword) {
      return false
    }
    return await comparePassword(plainPassword, this.password)
  }

  async changePassword(newPassword: string): Promise<void> {
    if (!newPassword || newPassword.length < 6) {
      throw new Error('Password phải có ít nhất 6 ký tự')
    }

    const hashedPassword = await hashPassword(newPassword)
    this.password = hashedPassword
  }
}
