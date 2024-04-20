import { Express } from 'express'

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
  roles: string[] | null
  groups: string[] | null
}
