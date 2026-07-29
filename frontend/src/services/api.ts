import { AuthResponse, PaginatedResponse, ProductCatalogItem, Transaction, Wallet } from '../types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

type HttpMethod = 'GET' | 'POST'

async function request<T>(path: string, method: HttpMethod = 'GET', body?: unknown, token?: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload.message ?? 'Milean Pay request failed')
  }

  return payload.data ?? payload
}

export const mileanApi = {
  register: (body: Record<string, unknown>) => request<AuthResponse>('/api/auth/register', 'POST', body),
  login: (body: Record<string, unknown>) => request<AuthResponse>('/api/auth/login', 'POST', body),
  wallet: (token: string) => request<Wallet>('/api/wallet', 'GET', undefined, token),
  transactions: (token: string) => request<PaginatedResponse<Transaction>>('/api/wallet/transactions', 'GET', undefined, token),
  catalog: (token: string) => request<ProductCatalogItem[]>('/api/products/catalog', 'GET', undefined, token),
  purchase: (token: string, body: Record<string, unknown>) => request('/api/products/purchase', 'POST', body, token),
  transfer: (token: string, body: Record<string, unknown>) => request('/api/transfers/internal', 'POST', body, token),
}
