import { User } from '@prisma/client'

export function sanitizeUser(user: User) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    referralCode: user.referralCode,
    isEmailVerified: user.isEmailVerified,
    isPhoneVerified: user.isPhoneVerified,
    hasTransactionPin: Boolean(user.transactionPinHash),
    kycStatus: user.kycStatus,
    createdAt: user.createdAt,
  }
}
