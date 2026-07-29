import { NextFunction, Request, Response } from 'express'
import * as authService from '../services/auth.service'

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.register(req.body)
    res.status(201).json({ success: true, message: 'Registration successful', data: result })
  } catch (error) {
    next(error)
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body)
    res.json({ success: true, message: 'Login successful', data: result })
  } catch (error) {
    next(error)
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.refresh(req.body.refreshToken)
    res.json({ success: true, message: 'Token refreshed', data: result })
  } catch (error) {
    next(error)
  }
}

export async function profile(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.getProfile(req.authUser!.id)
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}
