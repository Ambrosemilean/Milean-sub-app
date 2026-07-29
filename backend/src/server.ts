import app from './app'
import { env } from './config/env'
import { prisma } from './config/prisma'

const server = app.listen(env.PORT, () => {
  console.log(`Milean Pay backend running on port ${env.PORT}`)
})

async function shutdown() {
  await prisma.$disconnect()
  server.close(() => process.exit(0))
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
