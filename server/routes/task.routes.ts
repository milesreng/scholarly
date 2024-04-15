import express from 'express'
import { checkAuth } from '../middleware/checkAuth'
import { taskController } from '../controllers/task.controller'

const router = express.Router()

// @route   GET api/tasks/
// @desc    Get tasks by user
router.get('/', checkAuth, taskController.getAllUserTasks)

// @route   GET api/tasks/:id
// @desc    Get task by id
router.get('/:id', checkAuth, taskController.getTaskById)

// @route   POST api/tasks/
// @desc    Create a new task
router.post('/', checkAuth, taskController.createTask)

export default router