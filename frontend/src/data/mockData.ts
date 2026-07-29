import { ApplicationModule, ProductCatalogItem, Transaction, Wallet } from '../types'

export const demoWallet: Wallet = {
  id: 'wallet_demo',
  accountNumber: '8123456789',
  currency: 'NGN',
  balance: 245800,
  ledgerBalance: 245800,
  status: 'ACTIVE',
}

export const demoTransactions: Transaction[] = [
  {
    id: 'txn_1',
    reference: 'MPTRANSFER_001_DR',
    type: 'DEBIT',
    channel: 'INTERNAL_TRANSFER',
    status: 'SUCCESS',
    amount: 15000,
    balanceBefore: 260800,
    balanceAfter: 245800,
    narration: 'Transfer to Ada Okafor',
    createdAt: '2026-07-29T16:04:00.000Z',
  },
  {
    id: 'txn_2',
    reference: 'MPBILL_002',
    type: 'DEBIT',
    channel: 'DATA',
    status: 'SUCCESS',
    amount: 1500,
    balanceBefore: 262300,
    balanceAfter: 260800,
    narration: 'MTN Corporate 5GB purchase',
    createdAt: '2026-07-29T12:14:00.000Z',
  },
  {
    id: 'txn_3',
    reference: 'MPCREDIT_003',
    type: 'CREDIT',
    channel: 'WALLET_DEPOSIT',
    status: 'SUCCESS',
    amount: 50000,
    balanceBefore: 212300,
    balanceAfter: 262300,
    narration: 'Wallet funding',
    createdAt: '2026-07-28T19:36:00.000Z',
  },
]

export const productCatalog: ProductCatalogItem[] = [
  { category: 'AIRTIME', provider: 'MTN', products: [{ code: 'MTN_AIRTIME', name: 'MTN Airtime', minAmount: 50 }] },
  { category: 'AIRTIME', provider: 'Airtel', products: [{ code: 'AIRTEL_AIRTIME', name: 'Airtel Airtime', minAmount: 50 }] },
  { category: 'DATA', provider: 'MTN', products: [{ code: 'MTN_SME_1GB', name: 'MTN SME 1GB', fixedAmount: 300 }, { code: 'MTN_CORP_5GB', name: 'MTN Corporate 5GB', fixedAmount: 1500 }] },
  { category: 'CABLE_TV', provider: 'DStv', products: [{ code: 'DSTV_COMPACT', name: 'DStv Compact', fixedAmount: 12500 }, { code: 'DSTV_PREMIUM', name: 'DStv Premium', fixedAmount: 29500 }] },
  { category: 'ELECTRICITY', provider: 'IKEDC', products: [{ code: 'IKEDC_PREPAID', name: 'IKEDC Prepaid', minAmount: 1000 }] },
  { category: 'INTERNET', provider: 'Smile', products: [{ code: 'SMILE_UNLIMITED', name: 'Smile Unlimited', fixedAmount: 19000 }] },
  { category: 'BETTING', provider: 'SportyBet', products: [{ code: 'SPORTYBET_FUNDING', name: 'SportyBet Wallet Funding', minAmount: 100 }] },
  { category: 'EDUCATION', provider: 'WAEC', products: [{ code: 'WAEC_PIN', name: 'WAEC Result Checker PIN', fixedAmount: 4000 }] },
]

export const moduleRegistry: ApplicationModule[] = [
  { name: 'Authentication', status: 'implemented', channels: ['Web', 'Android', 'API'] },
  { name: 'Wallet', status: 'implemented', channels: ['Web', 'Android', 'API'] },
  { name: 'Transfers', status: 'implemented', channels: ['Web', 'Android', 'API'] },
  { name: 'Airtime', status: 'implemented', channels: ['Web', 'Android', 'API'] },
  { name: 'Data', status: 'implemented', channels: ['Web', 'Android', 'API'] },
  { name: 'Cable TV', status: 'implemented', channels: ['Web', 'Android', 'API'] },
  { name: 'Electricity', status: 'implemented', channels: ['Web', 'Android', 'API'] },
  { name: 'Internet', status: 'implemented', channels: ['Web', 'Android', 'API'] },
  { name: 'Betting', status: 'implemented', channels: ['Web', 'Android', 'API'] },
  { name: 'Education', status: 'implemented', channels: ['Web', 'Android', 'API'] },
  { name: 'Virtual Cards', status: 'schema-ready', channels: ['Web', 'Android', 'API'] },
  { name: 'Savings', status: 'schema-ready', channels: ['Web', 'Android', 'API'] },
  { name: 'Loans', status: 'schema-ready', channels: ['Web', 'Android', 'API'] },
  { name: 'Admin Dashboard', status: 'planned', channels: ['Web'] },
]
