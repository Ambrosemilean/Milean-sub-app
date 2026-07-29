import { Router } from 'express'
import { z } from 'zod'
import * as productController from '../controllers/product.controller'
import { requireAuth } from '../middleware/auth.middleware'
import { validateBody } from '../middleware/validate.middleware'

const router = Router()

const purchaseSchema = z.object({
  category: z.enum(['AIRTIME', 'DATA', 'ELECTRICITY', 'CABLE_TV', 'INTERNET', 'BETTING', 'EDUCATION']),
  provider: z.string().min(2).max(80),
  productCode: z.string().min(2).max(80),
  customerReference: z.string().min(3).max(80),
  amount: z.number().positive().max(5_000_000),
  metadata: z.record(z.unknown()).optional(),
})

router.use(requireAuth)
router.get('/catalog', productController.getCatalog)
router.post('/purchase', validateBody(purchaseSchema), productController.purchaseProduct)
router.get('/payments', productController.listBillPayments)

export default router
