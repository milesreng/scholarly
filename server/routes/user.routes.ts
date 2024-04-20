import express from 'express'
import { checkAuth } from '../middleware/checkAuth'
import { userController } from '../controllers/user.controller'

const router = express.Router()

// @route   GET api/users/profile
// @desc    Get user data
router.get('/profile', checkAuth, userController.getUser)

// @route   GET api/users/projects
// @desc    Get user projects
router.get('/projects', checkAuth, userController.getProjects)

// @route   GET api/users/:id
// @desc    Get user by id
router.get('/:id', checkAuth, userController.getUserById)

export default router