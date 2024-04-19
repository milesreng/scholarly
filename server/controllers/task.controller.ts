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

    const newTask = new Task({
      title: taskContent.title,
      description: taskContent.description,
      status: taskContent.status || false,
      dueDate: taskContent.dueDate,
      creatorId: (req.user as OIDCUser)?.preferred_username,
      userIds: taskContent.userIds,
      projectId: new mongoose.Types.ObjectId(taskContent.projectId)
    })

    await newTask.save()

    return res.status(200).json(newTask)
  },
  updateTask: async (req: Request, res: Response) => {
    let taskId = req.params.id
    const updateTask = req.body

    const task = await Task.findById(taskId)

    if ((req.user as OIDCUser)?.preferred_username !== task.creatorId) {
      return res.status(401).send('unauthorized')
    }

    const result = await Task.updateOne(
      { _id: taskId },
      { 
        title: updateTask.title,
        description: updateTask.description,
        userIds: updateTask.userIds,
        dueDate: updateTask.dueDate,
        status: updateTask.status
      }
    )

    return res.status(200)
  },
  deleteTask: async (req: Request, res: Response) => {
    const task = await Task.findById(req.params.id)

    if (task.creatorId !== (req.user as OIDCUser)?.preferred_username) {
      return res.status(401)
    }

    await Task.findByIdAndDelete(req.params.id)

    return res.status(200).send('task deleted')
  }
}