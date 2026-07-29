import { Router } from 'express'
import { z } from 'zod'
import * as authController from '../controllers/auth.controller'
import { requireAuth } from '../middleware/auth.middleware'
import { validateBody } from '../middleware/validate.middleware'

const router = Router()

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must include an uppercase letter')
  .regex(/[a-z]/, 'Password must include a lowercase letter')
  .regex(/[0-9]/, 'Password must include a number')

const registerSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  password: passwordSchema,
  bvn: z.string().length(11).optional(),
  nin: z.string().length(11).optional(),
  referralCode: z.string().max(20).optional(),
})

const loginSchema = z.object({
  emailOrPhone: z.string().min(3),
  password: z.string().min(1),
})

const refreshSchema = z.object({
  refreshToken: z.string().min(20),
})

router.post('/register', validateBody(registerSchema), authController.register)
router.post('/login', validateBody(loginSchema), authController.login)
router.post('/refresh-token', validateBody(refreshSchema), authController.refresh)
router.get('/profile', requireAuth, authController.profile)

export default router
