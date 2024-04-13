import express, { Request, Response } from 'express'
import { Project } from '../models/project.model'
import { AutoEncryptionLoggerLevel, ObjectId } from 'mongodb'
import { OIDCUser } from '../models/user.model'
import mongoose, { Mongoose } from 'mongoose'
import { logger } from '../server'
import { Task } from '../models/task.model'

export const projectController = {
  getProjectById: async (req: Request, res: Response) => {
    try {
      const projectId = req.params.id
      logger.info(req.user)
      const userId = (req.user as OIDCUser).preferred_username

      const project = await Project.findById(new ObjectId(projectId))

      if (!project || !project.memberIds.includes(userId)) {
        return res.status(401).send('unauthorized')
      }

      return res.status(200).json(project)

    } catch (error) {
      
    }
  },
  getTasksByProject: async (req: Request, res: Response) => {
    const projectId = req.params.id
    const tasks = await Task.find({ projectId: new ObjectId(projectId) })

    return res.json(tasks)
  }
}