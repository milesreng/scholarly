import mongoose from 'mongoose'
import { Task } from '../models/task.model'
import { OIDCUser } from '../models/user.model'
import { Request, Response } from 'express'
import { logger } from '../server'
import { ObjectId } from 'mongodb'
import { checkAdmin } from '../middleware/checkAuth'

export const taskController = {
  getTaskById: async (req: Request, res: Response) => {
    const id = req.params.id
    const task = await Task.findById(new ObjectId(id))

    return res.status(200).json(task)
  },
  getAllUserTasks: async (req: Request, res: Response) => {
    const sortField = req.query.sort || 'dueDate'
    const order = req.query.order || 1

    let options: any = {}
    options[(sortField as string)] = order

    const tasks = await Task.find({ userIds: (req.user as OIDCUser).preferred_username })
      .sort(options)
      
    return res.status(200).json(tasks || [])
  },
  createTask: async (req: Request, res: Response) => {
    const taskContent = req.body

    console.log('task', taskContent)

    await Task.create({
      title: taskContent.title,
      description: taskContent.description,
      status: taskContent.status || 'not-started',
      dueDate: taskContent.dueDate,
      creatorId: (req.user as OIDCUser)?.preferred_username,
      userIds: taskContent.userIds,
      projectId: new mongoose.Types.ObjectId(taskContent.projectId)
    })


    return res.status(200).json({ status: 'ok' })
  },
  updateTask: async (req: Request, res: Response, next: any) => {
    let taskId = req.params.id
    const updateTask = req.body

    const task = await Task.findById(taskId)

    if (task.creatorId !== (req.user as OIDCUser)?.preferred_username) {
      checkAdmin(req, res, next)
    }

    const result = await Task.updateOne(
      { _id: taskId },
      { 
        $set: {
          title: updateTask.title,
          description: updateTask.description,
          userIds: updateTask.userIds,
          dueDate: updateTask.dueDate,
          status: updateTask.status
        }
      }
    )

    return res.status(200).send(result)
  },
  deleteTask: async (req: Request, res: Response, next: any) => {
    const task = await Task.findById(req.params.id)

    if (task.creatorId !== (req.user as OIDCUser)?.preferred_username) {
      checkAdmin(req, res, next)
    }

    await Task.findByIdAndDelete(req.params.id)

    return res.status(200).send('task deleted')
  }
}