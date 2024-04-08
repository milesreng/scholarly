import { Request, Response } from 'express'

export const checkAuth = async (req: Request, res: Response, next: any) => {
  try {
    const token = req.headers['x-access-token']

    // verify token

    next()
  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: 'unauthorized' })
  }
}