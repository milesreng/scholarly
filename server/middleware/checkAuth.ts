import { Request, Response } from 'express'

export const checkAuth = async (req: Request, res: Response, next: any) => {
  console.log('Session:', req.session)
  if (!req.isAuthenticated()) { return res.status(401) }
  
  next()
}