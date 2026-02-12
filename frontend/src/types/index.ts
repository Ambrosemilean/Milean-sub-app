export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Plan {
  id: string
  name: string
  description: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'canceled' | 'paused'
  currentPeriodStart: string
  currentPeriodEnd: string
  canceledAt?: string
  createdAt: string
  updatedAt: string
}

export interface Invoice {
  id: string
  subscriptionId: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  dueDate: string
  paidAt?: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
