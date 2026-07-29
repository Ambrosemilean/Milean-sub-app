import { NextFunction, Request, Response } from 'express'
import * as walletService from '../services/wallet.service'

export async function getWallet(req: Request, res: Response, next: NextFunction) {
  try {
    const wallet = await walletService.getWallet(req.authUser!.id)
    res.json({ success: true, data: wallet })
  } catch (error) {
    next(error)
  }
}

export async function fundWallet(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await walletService.fundWallet(req.authUser!.id, req.body)
    res.status(201).json({ success: true, message: 'Wallet funded successfully', data: result })
  } catch (error) {
    next(error)
  }
}

export async function withdrawFromWallet(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await walletService.withdrawFromWallet(req.authUser!.id, req.body)
    res.json({ success: true, message: 'Withdrawal completed successfully', data: result })
  } catch (error) {
    next(error)
  }
}

export async function listTransactions(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page ?? 1)
    const pageSize = Number(req.query.pageSize ?? 20)
    const result = await walletService.listTransactions(req.authUser!.id, page, pageSize)
    res.json({ success: true, ...result })
  } catch (error) {
    next(error)
  }
}
