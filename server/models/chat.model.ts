import mongoose from 'mongoose'

interface IChatMessage extends mongoose.Document {
  content: string,
  visibility: 'private' | 'group',
  sender: mongoose.Schema.Types.ObjectId,
  recipients: mongoose.Schema.Types.ObjectId[],
  group: mongoose.Schema.Types.ObjectId,
}

const chatMessageSchema = new mongoose.Schema<IChatMessage>({
  content: {
    type: String,
    required: true
  },
  visibility: {
    type: String,
    enum: ['private', 'group'],
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipients: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  },
}, { timestamps: true })

export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema)