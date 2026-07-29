import { Request, Response } from 'express'
import { getApplicationModules } from '../services/platform.service'

export function modules(_req: Request, res: Response) {
  res.json({ success: true, data: getApplicationModules() })
}
