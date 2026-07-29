-- Demo data for local Milean Pay frontend/database walkthroughs.
INSERT INTO "User" ("id", "fullName", "email", "phone", "passwordHash", "referralCode") VALUES
  ('user_demo_ada', 'Ada Okafor', 'ada@mileanpay.test', '08012345678', 'demo_hash_replace_before_live', 'ADA123456'),
  ('user_demo_tunde', 'Tunde Balogun', 'tunde@mileanpay.test', '08087654321', 'demo_hash_replace_before_live', 'TUND123456')
ON CONFLICT DO NOTHING;

INSERT INTO "Wallet" ("id", "userId", "accountNumber", "balance", "ledgerBalance") VALUES
  ('wallet_demo_ada', 'user_demo_ada', '8123456789', 245800.00, 245800.00),
  ('wallet_demo_tunde', 'user_demo_tunde', '8987654321', 50000.00, 50000.00)
ON CONFLICT DO NOTHING;

INSERT INTO "Transaction" ("id", "userId", "walletId", "reference", "type", "channel", "status", "amount", "balanceBefore", "balanceAfter", "narration") VALUES
  ('txn_demo_1', 'user_demo_ada', 'wallet_demo_ada', 'MPCREDIT_DEMO_001', 'CREDIT', 'WALLET_DEPOSIT', 'SUCCESS', 50000.00, 195800.00, 245800.00, 'Wallet funding'),
  ('txn_demo_2', 'user_demo_ada', 'wallet_demo_ada', 'MPBILL_DEMO_002', 'DEBIT', 'DATA', 'SUCCESS', 1500.00, 247300.00, 245800.00, 'MTN Corporate 5GB purchase')
ON CONFLICT DO NOTHING;

INSERT INTO "Beneficiary" ("id", "userId", "accountNumber", "accountName", "nickname") VALUES
  ('bene_demo_1', 'user_demo_ada', '8987654321', 'Tunde Balogun', 'Tunde')
ON CONFLICT DO NOTHING;
