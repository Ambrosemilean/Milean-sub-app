import { Prisma, TransactionChannel, TransactionType, WalletStatus } from '@prisma/client'
import { prisma } from '../config/prisma'
import { HttpError } from '../utils/httpError'

export type FundWalletInput = {
  amount: number
  narration?: string
  reference?: string
}

export type WithdrawWalletInput = {
  amount: number
  narration?: string
  reference?: string
}

function generateAccountNumber(phone?: string) {
  const digits = phone?.replace(/\D/g, '').slice(-9) ?? ''
  return `8${digits.padStart(9, String(Math.floor(Math.random() * 10)))}`
}

function generateReference(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`.toUpperCase()
}

function toMoney(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new HttpError(400, 'Amount must be greater than zero')
  }

  return new Prisma.Decimal(amount).toDecimalPlaces(2)
}

export async function createWalletForUser(userId: string, phone?: string) {
  const existingWallet = await prisma.wallet.findUnique({ where: { userId } })

  if (existingWallet) {
    return existingWallet
  }

  return prisma.wallet.create({
    data: {
      userId,
      accountNumber: generateAccountNumber(phone),
    },
  })
}

export async function getWallet(userId: string) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } })

  if (!wallet) {
    throw new HttpError(404, 'Wallet not found')
  }

  return wallet
}

export async function fundWallet(userId: string, input: FundWalletInput) {
  const amount = toMoney(input.amount)

  return prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({ where: { userId } })

    if (!wallet) {
      throw new HttpError(404, 'Wallet not found')
    }

    if (wallet.status !== WalletStatus.ACTIVE) {
      throw new HttpError(423, 'Wallet is not active')
    }

    const balanceBefore = wallet.balance
    const balanceAfter = balanceBefore.plus(amount)

    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: balanceAfter,
        ledgerBalance: balanceAfter,
      },
    })

    const transaction = await tx.transaction.create({
      data: {
        userId,
        walletId: wallet.id,
        reference: input.reference ?? generateReference('MPCREDIT'),
        type: TransactionType.CREDIT,
        channel: TransactionChannel.WALLET_DEPOSIT,
        status: 'SUCCESS',
        amount,
        balanceBefore,
        balanceAfter,
        narration: input.narration ?? 'Wallet funding',
      },
    })

    return { wallet: updatedWallet, transaction }
  })
}

export async function withdrawFromWallet(userId: string, input: WithdrawWalletInput) {
  const amount = toMoney(input.amount)

  return prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({ where: { userId } })

    if (!wallet) {
      throw new HttpError(404, 'Wallet not found')
    }

    if (wallet.status !== WalletStatus.ACTIVE) {
      throw new HttpError(423, 'Wallet is not active')
    }

    if (wallet.balance.lessThan(amount)) {
      throw new HttpError(400, 'Insufficient wallet balance')
    }

    const balanceBefore = wallet.balance
    const balanceAfter = balanceBefore.minus(amount)

    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: balanceAfter,
        ledgerBalance: balanceAfter,
      },
    })

    const transaction = await tx.transaction.create({
      data: {
        userId,
        walletId: wallet.id,
        reference: input.reference ?? generateReference('MPDEBIT'),
        type: TransactionType.DEBIT,
        channel: TransactionChannel.WALLET_WITHDRAWAL,
        status: 'SUCCESS',
        amount,
        balanceBefore,
        balanceAfter,
        narration: input.narration ?? 'Wallet withdrawal',
      },
    })

    return { wallet: updatedWallet, transaction }
  })
}

export async function listTransactions(userId: string, page = 1, pageSize = 20) {
  const safePage = Math.max(page, 1)
  const safePageSize = Math.min(Math.max(pageSize, 1), 100)

  const [total, transactions] = await prisma.$transaction([
    prisma.transaction.count({ where: { userId } }),
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (safePage - 1) * safePageSize,
      take: safePageSize,
    }),
  ])

  return {
    data: transactions,
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages: Math.ceil(total / safePageSize),
  }
}
