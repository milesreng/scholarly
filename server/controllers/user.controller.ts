import { Request, Response } from 'express'
import { OIDCUser } from '../models/user.model'
import { Project } from '../models/project.model'

export const userController = {
  getUser: async (req: Request, res: Response) => {
    return res.json(req.user || {})
  },
  getProjects: async (req: Request, res: Response) => {
    const userId = (req.user as OIDCUser)?.preferred_username
    const projects = await Project.find({
      $or: [{ userIds: userId }, { adminIds: userId }, { creatorIds: userId }]
    })

    console.log('hello????')
    console.log(projects)

    return res.json(projects || [])
  }
}