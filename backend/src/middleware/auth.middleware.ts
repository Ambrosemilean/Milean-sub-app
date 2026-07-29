import { NextFunction, Request, Response } from 'express'
import { HttpError } from '../utils/httpError'
import { verifyAccessToken } from '../utils/tokens'

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        id: string
        email: string
      }
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const authorization = req.header('authorization')

  if (!authorization?.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Authentication token is required'))
  }

  try {
    req.authUser = verifyAccessToken(authorization.replace('Bearer ', ''))
    return next()
  } catch (error) {
    return next(new HttpError(401, 'Authentication token is invalid or expired'))
  }
}
