import mongoose from 'mongoose'
import { User } from '../models/user.model'
import { Request, Response } from 'express'

export const userController = {
  register: async (req: Request, res: Response) => {
    try {


      res.status(200).json({})
    } catch (error) {
      console.log(error.message)
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      res.status(200).json({})
    } catch (error) {
      console.log(error.message)
    }
  },
  getUser: async (req: Request, res: Response) => {
    try {
      const userId = new mongoose.Schema.Types.ObjectId(req.body.userId)
      
      const user = await User.findById(userId)

      res.status(200).json({ user })
    } catch (error) {
      console.log(error.message)
      res.status(404).json({ error })
    }
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