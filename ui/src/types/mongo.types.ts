import mongoose from 'mongoose'

export interface ITask extends mongoose.Document {
  title: string
  dueDate: Date | null
  description: string | null
  status: 'not-started' | 'in-progress' | 'complete'
  creatorId: string
  userIds: string[]
  projectId: mongoose.Schema.Types.ObjectId | null
}

export interface IProject extends mongoose.Document {
  title: string
  description: string
  creatorId: string
  memberIds: [string]
}
