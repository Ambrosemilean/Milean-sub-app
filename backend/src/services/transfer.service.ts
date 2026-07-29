import { Prisma, TransactionChannel, TransactionType, WalletStatus } from '@prisma/client'
import { prisma } from '../config/prisma'
import { HttpError } from '../utils/httpError'

export type InternalTransferInput = {
  accountNumber: string
  amount: number
  narration?: string
  saveBeneficiary?: boolean
  beneficiaryNickname?: string
}

function toMoney(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new HttpError(400, 'Amount must be greater than zero')
  }

  return new Prisma.Decimal(amount).toDecimalPlaces(2)
}

function generateReference(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`.toUpperCase()
}

export async function resolveMileanAccount(accountNumber: string) {
  const wallet = await prisma.wallet.findUnique({
    where: { accountNumber },
    include: { user: true },
  })

  if (!wallet) {
    throw new HttpError(404, 'Milean Pay account not found')
  }

  if (wallet.status !== WalletStatus.ACTIVE) {
    throw new HttpError(423, 'Recipient wallet is not active')
  }

  return {
    accountNumber: wallet.accountNumber,
    accountName: wallet.user.fullName,
    bankName: 'Milean Pay',
  }
}

export async function createBeneficiary(userId: string, accountNumber: string, nickname?: string) {
  const account = await resolveMileanAccount(accountNumber)

  return prisma.beneficiary.upsert({
    where: {
      userId_accountNumber: {
        userId,
        accountNumber: account.accountNumber,
      },
    },
    update: {
      accountName: account.accountName,
      bankName: account.bankName,
      nickname,
    },
    create: {
      userId,
      accountNumber: account.accountNumber,
      accountName: account.accountName,
      bankName: account.bankName,
      nickname,
    },
  })
}

export async function listBeneficiaries(userId: string) {
  return prisma.beneficiary.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function internalTransfer(userId: string, input: InternalTransferInput) {
  const amount = toMoney(input.amount)
  const narration = input.narration ?? 'Milean Pay internal transfer'
  const reference = generateReference('MPTRANSFER')

  return prisma.$transaction(async (tx) => {
    const senderWallet = await tx.wallet.findUnique({ where: { userId } })
    const recipientWallet = await tx.wallet.findUnique({
      where: { accountNumber: input.accountNumber },
      include: { user: true },
    })

    if (!senderWallet) {
      throw new HttpError(404, 'Sender wallet not found')
    }

    if (!recipientWallet) {
      throw new HttpError(404, 'Recipient wallet not found')
    }

    if (senderWallet.id === recipientWallet.id) {
      throw new HttpError(400, 'You cannot transfer to your own wallet')
    }

    if (senderWallet.status !== WalletStatus.ACTIVE) {
      throw new HttpError(423, 'Sender wallet is not active')
    }

    if (recipientWallet.status !== WalletStatus.ACTIVE) {
      throw new HttpError(423, 'Recipient wallet is not active')
    }

    if (senderWallet.balance.lessThan(amount)) {
      throw new HttpError(400, 'Insufficient wallet balance')
    }

    const senderBalanceBefore = senderWallet.balance
    const senderBalanceAfter = senderBalanceBefore.minus(amount)
    const recipientBalanceBefore = recipientWallet.balance
    const recipientBalanceAfter = recipientBalanceBefore.plus(amount)

    const updatedSenderWallet = await tx.wallet.update({
      where: { id: senderWallet.id },
      data: {
        balance: senderBalanceAfter,
        ledgerBalance: senderBalanceAfter,
      },
    })

    const updatedRecipientWallet = await tx.wallet.update({
      where: { id: recipientWallet.id },
      data: {
        balance: recipientBalanceAfter,
        ledgerBalance: recipientBalanceAfter,
      },
    })

    const senderTransaction = await tx.transaction.create({
      data: {
        userId,
        walletId: senderWallet.id,
        reference: `${reference}_DR`,
        type: TransactionType.DEBIT,
        channel: TransactionChannel.INTERNAL_TRANSFER,
        status: 'SUCCESS',
        amount,
        balanceBefore: senderBalanceBefore,
        balanceAfter: senderBalanceAfter,
        narration,
        metadata: {
          recipientAccountNumber: recipientWallet.accountNumber,
          recipientName: recipientWallet.user.fullName,
        },
      },
    })

    const recipientTransaction = await tx.transaction.create({
      data: {
        userId: recipientWallet.userId,
        walletId: recipientWallet.id,
        reference: `${reference}_CR`,
        type: TransactionType.CREDIT,
        channel: TransactionChannel.INTERNAL_TRANSFER,
        status: 'SUCCESS',
        amount,
        balanceBefore: recipientBalanceBefore,
        balanceAfter: recipientBalanceAfter,
        narration,
        metadata: {
          senderWalletId: senderWallet.id,
        },
      },
    })

    let beneficiary = null

    if (input.saveBeneficiary) {
      beneficiary = await tx.beneficiary.upsert({
        where: {
          userId_accountNumber: {
            userId,
            accountNumber: recipientWallet.accountNumber,
          },
        },
        update: {
          accountName: recipientWallet.user.fullName,
          bankName: 'Milean Pay',
          nickname: input.beneficiaryNickname,
        },
        create: {
          userId,
          accountNumber: recipientWallet.accountNumber,
          accountName: recipientWallet.user.fullName,
          bankName: 'Milean Pay',
          nickname: input.beneficiaryNickname,
        },
      })
    }

    return {
      reference,
      senderWallet: updatedSenderWallet,
      recipientWallet: updatedRecipientWallet,
      senderTransaction,
      recipientTransaction,
      beneficiary,
    }
  })
}
