import { Express } from 'express'
import mongoose from 'mongoose';

export interface OIDCUser extends Express.User {
  preferred_username: string
  sub: string | null
  sub_legacy: string | null
  name: string
  nickname: string | null
  email: string
  email_verified: boolean
  profile: string
  picture: string | null 
}

export interface IUser extends mongoose.Document {
  oidc_username: string
  display_name: string
  public_view: boolean
}

export const userSchema = new mongoose.Schema<IUser>({
  oidc_username: {
    type: String,
    required: true,
    unique: true
  },
  display_name: {
    type: String,
  },
  public_view: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

export const MongoUser = mongoose.model<IUser>('User', userSchema)