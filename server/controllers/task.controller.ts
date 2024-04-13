import mongoose from 'mongoose'
import { Task } from '../models/task.model'
import { OIDCUser } from '../models/user.model'
import { Request, Response } from 'express'
import { logger } from '../server'
import { ObjectId } from 'mongodb'

export const taskController = {
  getTaskById: async (req: Request, res: Response) => {
    const id = req.params.id
    const task = await Task.findById(new ObjectId(id))

    return res.status(200).json(task)
  },
  getAllUserTasks: async (req: Request, res: Response) => {
    const tasks = await Task.find({ userIds: (req.user as OIDCUser).preferred_username })
      
    return res.status(200).json(tasks || [])
  },
  createTask: async (req: Request, res: Response) => {
    const taskContent = req.body

    if (!taskContent.title) return res.status(403).send('idk which error this is')

    const newTask = new Task({
        title: taskContent.title,
        description: taskContent.description || '',
        dueDate: taskContent.dueDate || null,
        creatorId: (req.user as OIDCUser)?.preferred_username || null,
        userIds: taskContent.assignedTo || [],
        projectId: taskContent.projectId ? new mongoose.Schema.Types.ObjectId(taskContent.projectId) : null,
    })

    await newTask.save()

    return res.status(200).json(newTask)
  }
}