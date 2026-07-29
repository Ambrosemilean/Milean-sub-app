import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env'
import { errorHandler, notFound } from './middleware/error.middleware'
import authRoutes from './routes/auth.routes'
import walletRoutes from './routes/wallet.routes'

const app = express()

app.use(helmet())
app.use(cors({ origin: env.CORS_ORIGIN }))
app.use(express.json({ limit: '1mb' }))
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'))

app.get('/health', (_req, res) => {
  res.json({ success: true, service: 'milean-pay-backend', status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/wallet', walletRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
