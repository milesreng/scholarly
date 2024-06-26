/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import pino from 'pino'
import cors from 'cors'
import dotenv from 'dotenv'
import { MongoClient, Db } from 'mongodb'
import MongoStore from 'connect-mongo'
import session from 'express-session'
import expressPinoLogger from 'express-pino-logger'
import { Issuer, Strategy, generators } from 'openid-client'
import passport from 'passport'
import { Strategy as CustomStrategy } from 'passport-custom'

import userRoutes from './routes/user.routes'
import taskRoutes from './routes/task.routes'
import projectRoutes from './routes/project.routes'
import { Collection } from 'mongoose'

dotenv.config()

const HOST = process.env.HOST || '127.0.0.1'
const ADMIN_GROUP_ID = 'scholarly-admin'
const DISABLE_SECURITY = process.env.DISABLE_SECURITY

const passportStrategies = [
  ...(DISABLE_SECURITY ? ['disable-security'] : []),
  'oidc',
]

// const client = new MongoClient(process.env.MONGODB_URI)
// let db: Db
// let tasks: Collection

const app = express()
const port = process.env.PORT || 5174

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

export const logger = pino({
  transport: {
    target: 'pino-pretty'
  }
})

app.use(expressPinoLogger({ logger }))

app.use(cors({
  origin: 'http://127.0.0.1:3001',
  credentials: true
}))

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

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user: any, done) => {
  logger.info('serializeUser')
  console.log(user)
  done(null, user)
})
passport.deserializeUser((user: any, done) => {
  logger.info('deserializeUser')
  console.log(user)
  done(null, user)
})

app.get('/api/auth/login', passport.authenticate(passportStrategies, {
  successReturnToOrRedirect: '/'
}))

app.get('/api/auth/callback', passport.authenticate(passportStrategies, {
  successReturnToOrRedirect: 'http://127.0.0.1:31000/',
  failureRedirect: 'http://127.0.0.1:31000',
}))

app.post('/api/auth/logout', (req: Request, res: Response, next: (err: any) => void) => {
  req.logout((err: any) => {
    if (err) return next(err)

    res.redirect('/')
  })
})

app.use('/api/user', userRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/projects', projectRoutes)

mongoose.set('strictQuery', true)

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  logger.info('Connected to MongoDB')

  passport.use('disable-security', new CustomStrategy((req, done) => {
    if (req.query.key !== DISABLE_SECURITY) {
      console.log('you must supply ?key=' + DISABLE_SECURITY + ' to log in via DISABLE_SECURITY')
      done(null, false)
    } else {
      done(null, { name: req.query.user, preferred_username: req.query.user, roles: [].concat(req.query.role) })
    }
  }))

  const issuer = await Issuer.discover('https://coursework.cs.duke.edu/')
  const client = new issuer.Client({ client_id: process.env.CLIENT_ID, client_secret: process.env.CLIENT_SECRET })

  const params = {
    scope: 'openid profile email',
    nonce: generators.nonce(),
    redirect_uri: `http://${HOST}:31000/api/auth/callback`,
    state: generators.state(),

    // forces a fresh login screen every time
    prompt: 'login'
  }

  const verify = async (tokenSet: any, userInfo: any, done: any) => {
    logger.info('oidc', JSON.stringify(userInfo))

    // const existUser = await MongoUser.findOne({ oidc_username: userInfo.preferred_username })

    // if (!existUser) {
    //   logger.info('user does not exist')
    //   const user = await MongoUser.create({
    //     oidc_username: userInfo.preferred_username,
    //     display_name: userInfo.name || null
    //   })
    // }

    userInfo.roles = userInfo.groups.includes(ADMIN_GROUP_ID) ? ['admin'] : ['member']
    return done(null, userInfo)
  }

  passport.use('oidc', new Strategy({client, params}, verify))

  app.listen(port, () => {
    logger.info(`Server listening on port ${port}`)
  })
})