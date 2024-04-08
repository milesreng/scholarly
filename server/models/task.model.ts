import mongoose from 'mongoose'

export interface ITaskComment extends mongoose.Document {
  content: string
  author: mongoose.Schema.Types.ObjectId
}

export interface ITask extends mongoose.Document {
  title: string
  dueDate: Date
  description: string
  status: 'not-started' | 'in-progress' | 'complete'
  assignedTo: mongoose.Schema.Types.ObjectId[]
  comments: ITaskComment[]
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
  assignedTo: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User'
  },
  comments: {
    type: [new mongoose.Schema<ITaskComment>({
      content: {
        type: String,
        required: true
      }
    })]
  }
}, { timestamps: true })

export const Task = mongoose.model<ITask>('Task', taskSchema)