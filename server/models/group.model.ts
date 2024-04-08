import mongoose from 'mongoose'

// TODO: add role-specific permissions

interface IGroup extends mongoose.Document {
  name: string,
  description: string,
  owner: mongoose.Schema.Types.ObjectId,
  members: mongoose.Schema.Types.ObjectId[],
  tasks: mongoose.Schema.Types.ObjectId[]
}

const groupSchema = new mongoose.Schema<IGroup>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    required: true
  },
  tasks: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Task',
    required: true
  }
}, { timestamps: true })

export const Group = mongoose.model<IGroup>('Group', groupSchema)