import { NextFunction, Request, Response } from 'express'
import * as transferService from '../services/transfer.service'

export async function resolveAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await transferService.resolveMileanAccount(req.params.accountNumber)
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export async function internalTransfer(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await transferService.internalTransfer(req.authUser!.id, req.body)
    res.status(201).json({ success: true, message: 'Transfer completed successfully', data: result })
  } catch (error) {
    next(error)
  }
}

export async function createBeneficiary(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await transferService.createBeneficiary(req.authUser!.id, req.body.accountNumber, req.body.nickname)
    res.status(201).json({ success: true, message: 'Beneficiary saved successfully', data: result })
  } catch (error) {
    next(error)
  }
}

export async function listBeneficiaries(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await transferService.listBeneficiaries(req.authUser!.id)
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}
