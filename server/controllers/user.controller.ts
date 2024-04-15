import { Request, Response } from 'express'
import { OIDCUser, MongoUser } from '../models/user.model'
import { Project } from '../models/project.model'

export const userController = {
  getUser: async (req: Request, res: Response) => {
    const mongoUser = await MongoUser.findOne({ oidc_username: (req.user as OIDCUser)?.preferred_username })
    return res.json({ ...(req.user), ...mongoUser } || {})
  },
  getProjects: async (req: Request, res: Response) => {
    const userId = (req.user as OIDCUser)?.preferred_username
    const projects = await Project.find({
      $or: [{ userIds: userId }, { adminIds: userId }, { creatorIds: userId }]
    })

    console.log(projects)

    return res.json(projects || [])
  },
  getPublicUsers: async (req: Request, res: Response) => {
    const users = await MongoUser.find({ public_view: true })

    return res.json(users || [])
  },
  getUserById: async (req: Request, res: Response) => {
    const userId = req.params.id
  }
}