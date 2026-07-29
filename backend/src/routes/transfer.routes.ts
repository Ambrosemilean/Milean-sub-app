import { Router } from 'express'
import { z } from 'zod'
import * as transferController from '../controllers/transfer.controller'
import { requireAuth } from '../middleware/auth.middleware'
import { validateBody } from '../middleware/validate.middleware'

const router = Router()

const accountNumberSchema = z.string().length(10)

const internalTransferSchema = z.object({
  accountNumber: accountNumberSchema,
  amount: z.number().positive().max(5_000_000),
  narration: z.string().max(180).optional(),
  saveBeneficiary: z.boolean().optional(),
  beneficiaryNickname: z.string().max(60).optional(),
})

const beneficiarySchema = z.object({
  accountNumber: accountNumberSchema,
  nickname: z.string().max(60).optional(),
})

router.use(requireAuth)
router.get('/resolve/:accountNumber', transferController.resolveAccount)
router.post('/internal', validateBody(internalTransferSchema), transferController.internalTransfer)
router.get('/beneficiaries', transferController.listBeneficiaries)
router.post('/beneficiaries', validateBody(beneficiarySchema), transferController.createBeneficiary)

export default router
