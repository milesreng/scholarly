// import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'

export interface User {
  name: string,
  username: string,
  email: string,
}

export interface IUser extends mongoose.Document {
  name: string,
  username: string,
  email: string,
  // password: string,
}

export const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true })

// userSchema.plugin(passportLocalMongoose)

export const User = mongoose.model<IUser>('User', userSchema)

