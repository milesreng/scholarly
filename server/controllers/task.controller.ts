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

    console.log('task', taskContent)

    const newTask = new Task({
      title: taskContent.title,
      description: taskContent.description,
      status: taskContent.status || 'not-started',
      dueDate: taskContent.dueDate,
      creatorId: (req.user as OIDCUser)?.preferred_username,
      userIds: taskContent.userIds,
      projectId: new ObjectId(taskContent.projectId)
    })

    await newTask.save()

    return res.status(200).json(newTask)
  }
}