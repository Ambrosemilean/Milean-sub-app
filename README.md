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
