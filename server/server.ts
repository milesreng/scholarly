/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import cors from 'cors'
import dotenv from 'dotenv'
import { MongoClient, Db } from 'mongodb'
import MongoStore from 'connect-mongo'
import session from 'express-session'
import expressPinoLogger from 'express-pino-logger'
import { Issuer, Strategy, generators } from 'openid-client'
import passport from './config/passport'
import { connectDB } from './config/db.config'

import { User } from './models/user.model'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import groupRoutes from './routes/group.routes'

dotenv.config()

const client = new MongoClient(process.env.MONGODB_URI)
let db: Db

const app = express()
const port = process.env.PORT || 5174

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const logger = pino({
  transport: {
    target: 'pino-pretty'
  }
})

app.use(expressPinoLogger({ logger }))

app.use(cors())

app.use(session({
  secret: 'abcdefg',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 14 * 24 * 60 * 60 // 14 days
  })
}))

// declare module 'express-session' {
//   export interface SessionData {
//     credits?: number
//   }
// }

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
  console.log('serializeUser', user)
  done(null, user)
})
passport.deserializeUser((user, done) => {
  console.log('deserializeUser', user)
  done(null, user)
})

app.get('/api/auth/login', passport.authenticate('oidc', {
  successReturnToOrRedirect: '/'
}))

app.get('/api/auth/callback', passport.authenticate('oidc', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/',
}))

app.post('/api/auth/logout', (req: Request, res: Response, next: (err: any) => void) => {
  req.logout((err: any) => {
    if (err) return next(err)

    res.redirect('/')
  })
})

app.use('/api/users', userRoutes)
app.use('/api/groups', groupRoutes)

// app.get('/api', (req: Request, res: Response) => {
//   if (!req.isAuthenticated()) {
//     console.log('not authenticated')
//     return res.status(401).send('Please <a href="/api/auth/login">log in </a> first.')
//   }

//   const name = (req?.user as any)?.preferred_username || 'unknown'

//   return res.status(200).send(name)
// })

client.connect().then(async () => {
  logger.info('Connected to MongoDB')

  const issuer = await Issuer.discover('https://coursework.cs.duke.edu/')
  const client = new issuer.Client({ client_id: process.env.CLIENT_ID, client_secret: process.env.CLIENT_SECRET })

  const params = {
    scope: 'openid profile email',
    nonce: generators.nonce(),
    redirect_uri: 'http://127.0.0.1:5174/api/auth/callback',
    state: generators.state(),

    // forces a fresh login screen every time
    prompt: 'login'
  }

  const verify = async (tokenSet: any, userInfo: any, done: any) => {
    logger.info('oidc', JSON.stringify(userInfo))

    // role-based access control:
    // userInfo.roles = userInfo.groups.includes(ADMIN_GROUP_ID) ? ['admin'] : ['member']
    return done(null, userInfo)
  }

  passport.use('oidc', new Strategy({client, params}, verify))

  app.listen(port, () => {
    logger.info(`Server listening on port ${port}`)
  })
})