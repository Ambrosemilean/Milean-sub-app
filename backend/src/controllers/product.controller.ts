import { NextFunction, Request, Response } from 'express'
import * as productService from '../services/product.service'

export function getCatalog(_req: Request, res: Response) {
  res.json({ success: true, data: productService.getCatalog() })
}

export async function purchaseProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await productService.purchaseProduct(req.authUser!.id, req.body)
    res.status(201).json({ success: true, message: 'Purchase completed successfully', data: result })
  } catch (error) {
    next(error)
  }
}

export async function listBillPayments(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page ?? 1)
    const pageSize = Number(req.query.pageSize ?? 20)
    const result = await productService.listBillPayments(req.authUser!.id, page, pageSize)
    res.json({ success: true, ...result })
  } catch (error) {
    next(error)
  }
}
