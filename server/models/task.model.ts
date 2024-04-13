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

export const taskSchema = new mongoose.Schema<ITask>({
  title: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date
  },
  description: {
    type: String
  },
  status: {
    type: String, 
    enum: ['not-started', 'in-progress', 'complete'],
    default: 'not-started'
  },
  creatorId: {
    type: String,
    // required: true
  },
  userIds: {
    type: [String]
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }
}, { timestamps: true })

export const Task = mongoose.model<ITask>('Task', taskSchema)