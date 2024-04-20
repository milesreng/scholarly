import express, { Request, Response } from 'express'
import { Project } from '../models/project.model'
import { AutoEncryptionLoggerLevel, ObjectId } from 'mongodb'
import { OIDCUser } from '../models/user.model'
import { logger } from '../server'
import { Task } from '../models/task.model'
import { checkAdmin } from '../middleware/checkAuth'

export const projectController = {
  getProjectById: async (req: Request, res: Response, next: any) => {
    try {
      const projectId = req.params.id
      logger.info(req.user)
      const userId = (req.user as OIDCUser).preferred_username

      const project = await Project.findById(new ObjectId(projectId))

      if (!project || !project.memberIds.includes(userId) || project.creatorId !== userId) {
        checkAdmin(req, res, next)
      }

      return res.status(200).json(project)

    } catch (error) {
      
    }
  },
  createProject: async (req: Request, res: Response) => {
    const project = req.body

    const newProject = await Project.create({
      creatorId: (req.user as OIDCUser)?.preferred_username,
      title: project.title,
      description: project.description || null,
      memberIds: project.memberIds || []
    })

    return res.status(200).json(newProject)
  },
  updateProject: async (req: Request, res: Response) => {
    const projectId = req.params.id
    const updates = req.body

    const userId = (req.user as OIDCUser)?.preferred_username
    const project = await Project.findById(new ObjectId(projectId))

    if (project.creatorId !== userId) return res.status(401).send('unauthorized')

    const result = await Project.updateOne(
      {
        _id: projectId
      },
      {
        $set: {
          title: updates.title,
          description: updates.description,
          memberIds: updates.memberIds
        }
      }
    )

    return res.status(200).json({ status: 'ok' })
  },
  getUsersByProject: async (req: Request, res: Response) => {
    const projectId = req.params.id

    const userId = (req.user as OIDCUser)?.preferred_username
    const project = await Project.findById(new ObjectId(projectId))

    console.log('project', project)

    const userIds = [...project.memberIds, project.creatorId]

    return res.status(200).json(userIds)
  },
  getTasksByProject: async (req: Request, res: Response) => {
    const projectId = req.params.id

    if (!projectId) {
      const tasks = await Task.find({ userIds: (req.user as OIDCUser)?.preferred_username })
      return res.json(tasks)
    }
    const tasks = await Task.find({ projectId }).sort({ dueDate: 1 })

    return res.json(tasks)
  },
  getAllProjects: async (req: Request, res: Response) => {
    const projects = await Project.find({})

    return res.json(projects)
  },
  deleteProject: async (req: Request, res: Response) => {
    await Project.findByIdAndDelete(req.params.id)
    return res.status(200).json({ status: 'ok' })
  }
}