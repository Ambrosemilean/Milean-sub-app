-- Initial Milean Pay PostgreSQL schema for auth, wallets, transfers, products, and support modules.
CREATE TYPE "KycStatus" AS ENUM ('NOT_STARTED', 'PENDING', 'VERIFIED', 'REJECTED');
CREATE TYPE "WalletStatus" AS ENUM ('ACTIVE', 'FROZEN', 'CLOSED');
CREATE TYPE "TransactionType" AS ENUM ('CREDIT', 'DEBIT');
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REVERSED');
CREATE TYPE "TransactionChannel" AS ENUM ('WALLET_DEPOSIT', 'WALLET_WITHDRAWAL', 'INTERNAL_TRANSFER', 'BANK_TRANSFER', 'AIRTIME', 'DATA', 'ELECTRICITY', 'CABLE_TV', 'INTERNET', 'BETTING', 'EDUCATION', 'SAVINGS', 'LOAN', 'VIRTUAL_CARD');
CREATE TYPE "ProductCategory" AS ENUM ('AIRTIME', 'DATA', 'ELECTRICITY', 'CABLE_TV', 'INTERNET', 'BETTING', 'EDUCATION');
CREATE TYPE "BillPaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REVERSED');
CREATE TYPE "SavingsStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'BROKEN');
CREATE TYPE "LoanStatus" AS ENUM ('PENDING', 'APPROVED', 'DECLINED', 'DISBURSED', 'REPAID', 'DEFAULTED');
CREATE TYPE "VirtualCardStatus" AS ENUM ('ACTIVE', 'FROZEN', 'DELETED');
CREATE TYPE "NotificationType" AS ENUM ('PUSH', 'EMAIL', 'SMS', 'IN_APP');

CREATE TABLE "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "phone" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "referralCode" TEXT UNIQUE,
  "referredBy" TEXT,
  "bvn" TEXT,
  "nin" TEXT,
  "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
  "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
  "transactionPinHash" TEXT,
  "kycStatus" "KycStatus" NOT NULL DEFAULT 'NOT_STARTED',
  "refreshTokenHash" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Wallet" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE REFERENCES "User"("id") ON DELETE CASCADE,
  "accountNumber" TEXT NOT NULL UNIQUE,
  "currency" TEXT NOT NULL DEFAULT 'NGN',
  "balance" DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  "ledgerBalance" DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  "status" "WalletStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Beneficiary" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "accountNumber" TEXT NOT NULL,
  "accountName" TEXT NOT NULL,
  "bankName" TEXT NOT NULL DEFAULT 'Milean Pay',
  "nickname" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("userId", "accountNumber")
);

CREATE TABLE "Transaction" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "walletId" TEXT NOT NULL REFERENCES "Wallet"("id") ON DELETE CASCADE,
  "reference" TEXT NOT NULL UNIQUE,
  "type" "TransactionType" NOT NULL,
  "channel" "TransactionChannel" NOT NULL,
  "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
  "amount" DECIMAL(18,2) NOT NULL,
  "balanceBefore" DECIMAL(18,2) NOT NULL,
  "balanceAfter" DECIMAL(18,2) NOT NULL,
  "narration" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "BillPayment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "walletId" TEXT NOT NULL REFERENCES "Wallet"("id") ON DELETE CASCADE,
  "transactionId" TEXT UNIQUE REFERENCES "Transaction"("id"),
  "category" "ProductCategory" NOT NULL,
  "provider" TEXT NOT NULL,
  "productCode" TEXT NOT NULL,
  "customerReference" TEXT NOT NULL,
  "amount" DECIMAL(18,2) NOT NULL,
  "status" "BillPaymentStatus" NOT NULL DEFAULT 'PENDING',
  "externalReference" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "SavingsPlan" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "targetAmount" DECIMAL(18,2) NOT NULL,
  "balance" DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  "status" "SavingsStatus" NOT NULL DEFAULT 'ACTIVE',
  "maturityDate" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "LoanApplication" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "requestedAmount" DECIMAL(18,2) NOT NULL,
  "approvedAmount" DECIMAL(18,2),
  "tenorDays" INTEGER NOT NULL,
  "purpose" TEXT NOT NULL,
  "status" "LoanStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "VirtualCard" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "label" TEXT NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "maskedPan" TEXT NOT NULL,
  "status" "VirtualCardStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Notification" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "type" "NotificationType" NOT NULL DEFAULT 'IN_APP',
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "readAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_phone_idx" ON "User"("phone");
CREATE INDEX "Wallet_accountNumber_idx" ON "Wallet"("accountNumber");
CREATE INDEX "Beneficiary_userId_idx" ON "Beneficiary"("userId");
CREATE INDEX "Transaction_userId_createdAt_idx" ON "Transaction"("userId", "createdAt");
CREATE INDEX "Transaction_walletId_createdAt_idx" ON "Transaction"("walletId", "createdAt");
CREATE INDEX "BillPayment_userId_createdAt_idx" ON "BillPayment"("userId", "createdAt");
CREATE INDEX "BillPayment_category_provider_idx" ON "BillPayment"("category", "provider");
CREATE INDEX "SavingsPlan_userId_status_idx" ON "SavingsPlan"("userId", "status");
CREATE INDEX "LoanApplication_userId_status_idx" ON "LoanApplication"("userId", "status");
CREATE INDEX "VirtualCard_userId_status_idx" ON "VirtualCard"("userId", "status");
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"("userId", "readAt");
