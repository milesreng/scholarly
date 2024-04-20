import { Request, Response } from 'express'
import { OIDCUser } from '../models/user.model'

export const checkAuth = async (req: Request, res: Response, next: any) => {
  console.log('Session:', req.session)
  if (!req.isAuthenticated()) { return res.status(401) }
  
  next()
}

export const checkAdmin = async (req: Request, res: Response, next: any) => {
  if (!(req.user as OIDCUser)?.roles.includes('admin') || !req.isAuthenticated()) { 
    return res.status(401) 
  }
  
  next()
}