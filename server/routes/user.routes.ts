import express from 'express'
import { userController } from '../controllers/user.controller'

const router = express.Router()

// @route   GET api/users/
// @desc    Get user data
router.get('/user', userController.getUser)

// @route   GET api/users/
// @desc    Get user data
router.get('/', userController.getUsers)

export default router