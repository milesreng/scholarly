import { Request, Response } from 'express'
import { OIDCUser } from '../models/user.model'
import { Project } from '../models/project.model'
import { logger } from '../server'

export const userController = {
  getUser: async (req: Request, res: Response) => {
    return res.json({ ...(req.user) } || {})
  },
  getProjects: async (req: Request, res: Response) => {
    const userId = (req.user as OIDCUser)?.preferred_username
    const projects = await Project.find({
      $or: [{ memberIds: userId }, { creatorId: userId }]
    })


    logger.info('getting projects')
    console.log('Projects', projects)

    return res.json(projects || [])
  },
  getUserById: async (req: Request, res: Response) => {
    const userId = req.params.id
  }
}