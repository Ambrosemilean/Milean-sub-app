export type ModuleStatus = 'implemented' | 'schema-ready' | 'planned'
export type ProductCategory = 'AIRTIME' | 'DATA' | 'ELECTRICITY' | 'CABLE_TV' | 'INTERNET' | 'BETTING' | 'EDUCATION'

export interface User {
  id: string
  fullName: string
  email: string
  phone: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
  hasTransactionPin: boolean
  kycStatus: 'NOT_STARTED' | 'PENDING' | 'VERIFIED' | 'REJECTED'
  createdAt: string
}

export interface Wallet {
  id: string
  accountNumber: string
  currency: 'NGN'
  balance: number
  ledgerBalance: number
  status: 'ACTIVE' | 'FROZEN' | 'CLOSED'
}

export interface Transaction {
  id: string
  reference: string
  type: 'CREDIT' | 'DEBIT'
  channel: string
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REVERSED'
  amount: number
  balanceBefore: number
  balanceAfter: number
  narration: string
  createdAt: string
}

export interface Product {
  code: string
  name: string
  minAmount?: number
  fixedAmount?: number
}

export interface ProductCatalogItem {
  category: ProductCategory
  provider: string
  products: Product[]
}

export interface ApplicationModule {
  name: string
  status: ModuleStatus
  channels: string[]
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
  wallet: Wallet
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
