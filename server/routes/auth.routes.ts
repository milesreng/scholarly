/* eslint-disable quotes */
import express, { Request, Response } from 'express'
import passport from 'passport'

const router = express.Router()



router.get('/failed', (req: Request, res: Response) => {
  res.status(400).send('login failed')
})

router.get('/success', (req: Request, res: Response) => {
  res.status(200).send('login succeeded')
})

export default router