import { prisma } from '../config/prisma'
import { HttpError } from '../utils/httpError'
import { hashSecret, verifySecret } from '../utils/password'
import { sanitizeUser } from '../utils/sanitizeUser'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokens'
import { createWalletForUser } from './wallet.service'

export type RegisterInput = {
  fullName: string
  email: string
  phone: string
  password: string
  bvn?: string
  nin?: string
  referralCode?: string
}

export type LoginInput = {
  emailOrPhone: string
  password: string
}

function makeReferralCode(fullName: string) {
  const prefix = fullName.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase().padEnd(4, 'M')
  return `${prefix}${Math.floor(100000 + Math.random() * 900000)}`
}

async function buildTokenResponse(userId: string, email: string) {
  const tokenUser = { id: userId, email }
  const accessToken = signAccessToken(tokenUser)
  const refreshToken = signRefreshToken(tokenUser)
  const refreshTokenHash = await hashSecret(refreshToken)

  await prisma.user.update({
    where: { id: userId },
    data: { refreshTokenHash },
  })

  return { accessToken, refreshToken }
}

export async function register(input: RegisterInput) {
  const email = input.email.toLowerCase().trim()
  const phone = input.phone.trim()

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { phone }] },
  })

  if (existingUser?.email === email) {
    throw new HttpError(409, 'Email address is already registered')
  }

  if (existingUser?.phone === phone) {
    throw new HttpError(409, 'Phone number is already registered')
  }

  const passwordHash = await hashSecret(input.password)
  const user = await prisma.user.create({
    data: {
      fullName: input.fullName.trim(),
      email,
      phone,
      passwordHash,
      bvn: input.bvn,
      nin: input.nin,
      referralCode: makeReferralCode(input.fullName),
      referredBy: input.referralCode,
    },
  })

  const wallet = await createWalletForUser(user.id, user.phone)
  const tokens = await buildTokenResponse(user.id, user.email)

  return {
    user: sanitizeUser(user),
    wallet,
    ...tokens,
  }
}

export async function login(input: LoginInput) {
  const emailOrPhone = input.emailOrPhone.toLowerCase().trim()
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: emailOrPhone }, { phone: emailOrPhone }] },
  })

  if (!user) {
    throw new HttpError(401, 'Invalid login credentials')
  }

  const passwordMatches = await verifySecret(input.password, user.passwordHash)

  if (!passwordMatches) {
    throw new HttpError(401, 'Invalid login credentials')
  }

  const tokens = await buildTokenResponse(user.id, user.email)

  return {
    user: sanitizeUser(user),
    ...tokens,
  }
}

export async function refresh(refreshToken: string) {
  const decoded = verifyRefreshToken(refreshToken)
  const user = await prisma.user.findUnique({ where: { id: decoded.id } })

  if (!user?.refreshTokenHash) {
    throw new HttpError(401, 'Refresh token has expired or was revoked')
  }

  const isValidStoredToken = await verifySecret(refreshToken, user.refreshTokenHash)

  if (!isValidStoredToken) {
    throw new HttpError(401, 'Refresh token has expired or was revoked')
  }

  const tokens = await buildTokenResponse(user.id, user.email)

  return {
    user: sanitizeUser(user),
    ...tokens,
  }
}

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user) {
    throw new HttpError(404, 'User not found')
  }

  return sanitizeUser(user)
}
