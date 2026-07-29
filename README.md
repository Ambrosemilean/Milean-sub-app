# Milean Pay

Milean Pay is a fintech application blueprint for web and Android banking experiences. The current implementation provides a polished React/Vite landing experience that maps the major product modules for customer banking, airtime, data, subscriptions, security, and admin operations.

## Current web module

The frontend includes:

- A Milean Pay hero section for the shared web and Android banking product.
- Dashboard preview with wallet balance, quick actions, and recent successful transactions.
- Different customer page modules for onboarding, dashboard, wallet/transfers, subscriptions, cards/savings/loans, and profile/security.
- Service cards for airtime, data, electricity, and cable TV subscriptions.
- Architecture and admin dashboard sections that outline the backend, mobile, security, and operations modules.

## Planned platform architecture

- **Frontend web:** React, Vite, TypeScript, Tailwind CSS.
- **Android:** Flutter consuming the same backend APIs.
- **Backend:** Node.js/Express APIs backed by PostgreSQL, Redis, and Prisma.
- **Security:** JWT, refresh tokens, OTP, transaction PIN, 2FA, audit logs, and role-based access.
- **Integrations:** Monnify, Paystack, Flutterwave, VTpass, electricity providers, cable providers, Firebase Cloud Messaging, email, and SMS gateways.

## Module 2: Backend authentication

The backend now includes the Milean Pay authentication foundation:

- Registration with email, phone, BVN/NIN placeholders, referral tracking, password hashing, and sanitized responses.
- Login by email or phone with access and refresh token generation.
- Refresh-token rotation with hashed token storage.
- Protected profile endpoint using Bearer-token middleware.
- Zod validation, centralized error handling, Helmet, CORS, and request logging.
- Prisma user schema prepared for PostgreSQL and future KYC, wallet, and transaction modules.

### Backend development

```bash
cd backend
npm install
cp .env.example .env
npm run build
```

## Module 3: Wallet system

The backend now includes the Milean Pay wallet foundation:

- Automatic NGN wallet creation during registration.
- Unique customer wallet account numbers derived from the registered phone number.
- Protected wallet balance endpoint for authenticated users.
- Wallet funding and withdrawal endpoints with balance checks.
- Ledger-style transaction records with references, before/after balances, status, channel, and pagination.
- Prisma wallet and transaction models ready for bank transfers, airtime, data, electricity, and cable subscription debits.

### Wallet API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/wallet` | Get the authenticated user wallet |
| POST | `/api/wallet/fund` | Credit the user wallet |
| POST | `/api/wallet/withdraw` | Debit the user wallet after balance validation |
| GET | `/api/wallet/transactions` | List paginated wallet transactions |

## Module 4: Internal transfers and beneficiaries

The backend now includes Milean Pay internal transfer workflows:

- Resolve a Milean Pay account number before sending money.
- Transfer funds from one active wallet to another active wallet.
- Write paired debit and credit ledger transactions with shared transfer references.
- Reject self-transfers, inactive wallets, missing recipients, and insufficient balances.
- Save and list beneficiaries for faster repeat transfers.

### Transfer API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/transfers/resolve/:accountNumber` | Resolve a Milean Pay recipient account |
| POST | `/api/transfers/internal` | Send money to another Milean Pay wallet |
| GET | `/api/transfers/beneficiaries` | List saved beneficiaries |
| POST | `/api/transfers/beneficiaries` | Save or update a beneficiary |

## Development

```bash
cd frontend
npm install
npm run dev
```

## Build

```bash
cd frontend
npm run build
```
