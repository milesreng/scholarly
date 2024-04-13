import mongoose from 'mongoose'

// TODO: add role-specific permissions

export interface IProject extends mongoose.Document {
  title: string
  description: string
  creatorId: string
  adminIds: [string]
  memberIds: [string]
}

export const projectSchema = new mongoose.Schema<IProject>({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  creatorId: {
    type: String,
    required: true
  },
  adminIds: {
    type: [String],
  },
  memberIds: {
    type: [String],
  }
})

export const Project = mongoose.model<IProject>('Project', projectSchema)