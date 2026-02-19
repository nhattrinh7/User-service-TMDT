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

  // ===== PASSCODE METHODS =====

  hasPassCode(): boolean {
    return this.passCode !== null
  }

  async createPassCode(code: string): Promise<void> {
    if (this.passCode) {
      throw new Error('Passcode đã tồn tại. Vui lòng sử dụng chức năng đổi passcode.')
    }
    this.passCode = await hashPassword(code)
  }

  async verifyPassCode(plainCode: string): Promise<boolean> {
    if (!this.passCode) return false
    return await comparePassword(plainCode, this.passCode)
  }

  async changePassCode(oldCode: string, newCode: string): Promise<void> {
    if (!this.passCode) {
      throw new Error('Chưa có passcode. Vui lòng tạo passcode trước.')
    }
    const isValid = await comparePassword(oldCode, this.passCode)
    if (!isValid) {
      throw new Error('Passcode hiện tại không đúng')
    }
    this.passCode = await hashPassword(newCode)
  }

  requestPassCodeReset(): OTP {
    if (!this.passCode) {
      throw new Error('Chưa có passcode. Không thể reset.')
    }
    const otp = OTP.create(3) // 3 phút
    this.passCodeResetOtp = otp
    return otp
  }

  async resetPassCode(otpCode: string, newCode: string): Promise<void> {
    if (!this.passCodeResetOtp) {
      throw new Error('Chưa yêu cầu reset passcode')
    }
    if (!this.passCodeResetOtp.isValid(otpCode)) {
      if (this.passCodeResetOtp.isExpired()) {
        throw new Error('OTP đã hết hạn. Vui lòng yêu cầu gửi lại OTP mới.')
      }
      throw new Error('OTP không đúng')
    }
    this.passCode = await hashPassword(newCode)
    this.passCodeResetOtp = null // Xóa OTP sau khi reset thành công
  }
}
