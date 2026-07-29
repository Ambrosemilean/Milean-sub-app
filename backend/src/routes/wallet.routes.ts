import { Router } from 'express'
import { z } from 'zod'
import * as walletController from '../controllers/wallet.controller'
import { requireAuth } from '../middleware/auth.middleware'
import { validateBody } from '../middleware/validate.middleware'

const router = Router()

const moneySchema = z.object({
  amount: z.number().positive().max(5_000_000),
  narration: z.string().max(180).optional(),
  reference: z.string().max(80).optional(),
})

router.use(requireAuth)
router.get('/', walletController.getWallet)
router.post('/fund', validateBody(moneySchema), walletController.fundWallet)
router.post('/withdraw', validateBody(moneySchema), walletController.withdrawFromWallet)
router.get('/transactions', walletController.listTransactions)

export default router
