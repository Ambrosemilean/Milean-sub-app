import { Router } from 'express'
import * as platformController from '../controllers/platform.controller'

const router = Router()

router.get('/modules', platformController.modules)

export default router
