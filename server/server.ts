/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import cors from 'cors'
import dotenv from 'dotenv'
import passport from 'passport'
import MongoStore from 'connect-mongo'
import session from 'express-session'
import expressPinoLogger from 'express-pino-logger'
import { Issuer, Strategy, generators } from 'openid-client'
import { connectDB } from './config/db.config'

import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import groupRoutes from './routes/group.routes'

dotenv.config()

// const MongoStore = connectMongo(session)

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

app.use(cors({
  origin: 'http://127.0.0.1:5174',
  credentials: true,
}))

app.use(session({
  secret: 'abcdefg',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  // store: MongoStore.create({
  //   mongoUrl: process.env.MONGODB_URI,
  //   ttl: 24 * 60 * 60 // 1 day
  // })
}))

declare module 'express-session' {
//   export interface SessionData {
//     credits?: number
//   }
}

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

// app.use('/api/auth', authRoutes)

app.get('/api/auth/login', passport.authenticate('oidc', {
  successReturnToOrRedirect: '/'
}))

app.get('/api/auth/login-callback', passport.authenticate('oidc', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/'
})
)

app.post('/api/auth/logout', (req: Request, res: Response, next: (err: any) => void) => {
  req.logout((err: any) => {
    if (err) return next(err)

    res.redirect('/')
  })
})

app.get('/', (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).send('Please <a href="/api/auth/login">log in </a> first.')
    return
  }

  const name = (req?.user as any)?.preferred_username || 'unknown'

  res.status(200).send('Logged in ' + name)
})

app.use('/api/users', userRoutes)
app.use('/api/groups', groupRoutes)

connectDB()


Issuer.discover('https://coursework.cs.duke.edu/').then((issuer: Issuer) => {
  const client = new issuer.Client({ client_id: process.env.CLIENT_ID, client_secret: process.env.CLIENT_SECRET })

  const params = {
    scope: 'openid profile email',
    nonce: generators.nonce(),
    redirect_uri: 'http://127.0.0.1:5174/api/auth/login-callback',
    state: generators.state()
  }

  const verify = (tokenSet: any, userInfo: any, done: (error: any, user: any) => void) => {
    console.log('userInfo', userInfo)
    console.log('tokenSet', tokenSet)
    return done(null, userInfo)
  }

  passport.use('oidc', new Strategy({ client, params }, verify))


  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
})