import { Prisma, ProductCategory, TransactionChannel, TransactionType, WalletStatus } from '@prisma/client'
import { prisma } from '../config/prisma'
import { HttpError } from '../utils/httpError'

export type PurchaseProductInput = {
  category: ProductCategory
  provider: string
  productCode: string
  customerReference: string
  amount: number
  metadata?: Record<string, unknown>
}

type CatalogItem = {
  category: ProductCategory
  provider: string
  products: Array<{
    code: string
    name: string
    minAmount?: number
    fixedAmount?: number
  }>
}

export const productCatalog: CatalogItem[] = [
  {
    category: ProductCategory.AIRTIME,
    provider: 'MTN',
    products: [{ code: 'MTN_AIRTIME', name: 'MTN Airtime', minAmount: 50 }],
  },
  {
    category: ProductCategory.AIRTIME,
    provider: 'Airtel',
    products: [{ code: 'AIRTEL_AIRTIME', name: 'Airtel Airtime', minAmount: 50 }],
  },
  {
    category: ProductCategory.AIRTIME,
    provider: 'Glo',
    products: [{ code: 'GLO_AIRTIME', name: 'Glo Airtime', minAmount: 50 }],
  },
  {
    category: ProductCategory.AIRTIME,
    provider: '9mobile',
    products: [{ code: '9MOBILE_AIRTIME', name: '9mobile Airtime', minAmount: 50 }],
  },
  {
    category: ProductCategory.DATA,
    provider: 'MTN',
    products: [
      { code: 'MTN_SME_1GB', name: 'MTN SME 1GB', fixedAmount: 300 },
      { code: 'MTN_CORP_5GB', name: 'MTN Corporate 5GB', fixedAmount: 1500 },
    ],
  },
  {
    category: ProductCategory.DATA,
    provider: 'Airtel',
    products: [{ code: 'AIRTEL_2GB', name: 'Airtel 2GB', fixedAmount: 700 }],
  },
  {
    category: ProductCategory.CABLE_TV,
    provider: 'DStv',
    products: [
      { code: 'DSTV_COMPACT', name: 'DStv Compact', fixedAmount: 12500 },
      { code: 'DSTV_PREMIUM', name: 'DStv Premium', fixedAmount: 29500 },
    ],
  },
  {
    category: ProductCategory.CABLE_TV,
    provider: 'GOtv',
    products: [{ code: 'GOTV_MAX', name: 'GOtv Max', fixedAmount: 5700 }],
  },
  {
    category: ProductCategory.ELECTRICITY,
    provider: 'IKEDC',
    products: [{ code: 'IKEDC_PREPAID', name: 'IKEDC Prepaid', minAmount: 1000 }],
  },
  {
    category: ProductCategory.ELECTRICITY,
    provider: 'EKEDC',
    products: [{ code: 'EKEDC_PREPAID', name: 'EKEDC Prepaid', minAmount: 1000 }],
  },
  {
    category: ProductCategory.INTERNET,
    provider: 'Smile',
    products: [{ code: 'SMILE_UNLIMITED', name: 'Smile Unlimited', fixedAmount: 19000 }],
  },
  {
    category: ProductCategory.INTERNET,
    provider: 'Spectranet',
    products: [{ code: 'SPECTRANET_40GB', name: 'Spectranet 40GB', fixedAmount: 14000 }],
  },
  {
    category: ProductCategory.BETTING,
    provider: 'SportyBet',
    products: [{ code: 'SPORTYBET_FUNDING', name: 'SportyBet Wallet Funding', minAmount: 100 }],
  },
  {
    category: ProductCategory.EDUCATION,
    provider: 'WAEC',
    products: [{ code: 'WAEC_PIN', name: 'WAEC Result Checker PIN', fixedAmount: 4000 }],
  },
]

function generateReference(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`.toUpperCase()
}

function toMoney(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new HttpError(400, 'Amount must be greater than zero')
  }

  return new Prisma.Decimal(amount).toDecimalPlaces(2)
}

function channelFor(category: ProductCategory) {
  const channels: Record<ProductCategory, TransactionChannel> = {
    AIRTIME: TransactionChannel.AIRTIME,
    DATA: TransactionChannel.DATA,
    ELECTRICITY: TransactionChannel.ELECTRICITY,
    CABLE_TV: TransactionChannel.CABLE_TV,
    INTERNET: TransactionChannel.INTERNET,
    BETTING: TransactionChannel.BETTING,
    EDUCATION: TransactionChannel.EDUCATION,
  }

  return channels[category]
}

function findProduct(input: PurchaseProductInput) {
  const provider = productCatalog.find((item) => item.category === input.category && item.provider.toLowerCase() === input.provider.toLowerCase())
  const product = provider?.products.find((item) => item.code === input.productCode)

  if (!provider || !product) {
    throw new HttpError(404, 'Product is not available')
  }

  if (product.fixedAmount && product.fixedAmount !== input.amount) {
    throw new HttpError(400, `Product amount must be ${product.fixedAmount}`)
  }

  if (product.minAmount && input.amount < product.minAmount) {
    throw new HttpError(400, `Minimum amount is ${product.minAmount}`)
  }

  return { provider, product }
}

export function getCatalog() {
  return productCatalog
}

export async function purchaseProduct(userId: string, input: PurchaseProductInput) {
  const { product } = findProduct(input)
  const amount = toMoney(input.amount)
  const reference = generateReference('MPBILL')

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
        reference,
        type: TransactionType.DEBIT,
        channel: channelFor(input.category),
        status: 'SUCCESS',
        amount,
        balanceBefore,
        balanceAfter,
        narration: `${product.name} purchase`,
        metadata: {
          provider: input.provider,
          productCode: input.productCode,
          customerReference: input.customerReference,
        },
      },
    })

    const billPayment = await tx.billPayment.create({
      data: {
        userId,
        walletId: wallet.id,
        transactionId: transaction.id,
        category: input.category,
        provider: input.provider,
        productCode: input.productCode,
        customerReference: input.customerReference,
        amount,
        status: 'SUCCESS',
        externalReference: `SIM-${reference}`,
        metadata: input.metadata ?? {},
      },
    })

    await tx.notification.create({
      data: {
        userId,
        type: 'IN_APP',
        title: 'Subscription successful',
        message: `${product.name} was purchased successfully.`,
      },
    })

    return { wallet: updatedWallet, transaction, billPayment }
  })
}

export async function listBillPayments(userId: string, page = 1, pageSize = 20) {
  const safePage = Math.max(page, 1)
  const safePageSize = Math.min(Math.max(pageSize, 1), 100)

  const [total, data] = await prisma.$transaction([
    prisma.billPayment.count({ where: { userId } }),
    prisma.billPayment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (safePage - 1) * safePageSize,
      take: safePageSize,
    }),
  ])

  return {
    data,
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages: Math.ceil(total / safePageSize),
  }
}
