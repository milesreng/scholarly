import express from 'express'
import { userController } from '../controllers/user.controller'

const router = express.Router()

// @route   GET api/users/profile
// @desc    Get user data
router.get('/profile', userController.getUser)

// @route   GET api/users/projects
// @desc    Get user projects
router.get('/projects', userController.getProjects)

// @route   GET api/users/:id
// @desc    Get user by id
router.get('/:id', userController.getUserById)

export default router