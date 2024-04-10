import mongoose from 'mongoose'
import passport from '../config/passport'
import { User } from '../models/user.model'
import { Request, Response } from 'express'

export const userController = {
  getUser: async (req: Request, res: Response) => {
    return res.json(req.user || {})
  },
  getUsers: async (req: Request, res: Response) => {
    try {
      const users = await User.find({})

      res.status(200).json({ users })
    } catch (error) {
      console.log(error.message)
      res.status(404).json({ error })
    }
  }
}