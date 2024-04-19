import express from 'express'
import { checkAuth } from '../middleware/checkAuth'
import { taskController } from '../controllers/task.controller'

const router = express.Router()

// @route   PUT api/tasks/:id/status
// @desc    Update task status
router.put('/:id/status', checkAuth, taskController.updateTaskStatus)

// @route   PUT api/tasks/:id
// @desc    Update task
router.put('/:id', checkAuth, taskController.updateTask)

// @route   DELETE api/tasks/:id
// @desc    Delete task by id
router.delete('/:id', checkAuth, taskController.deleteTask)

// @route   GET api/tasks/:id
// @desc    Get task by id
router.get('/:id', checkAuth, taskController.getTaskById)

// @route   POST api/tasks/
// @desc    Create a new task
router.post('/', checkAuth, taskController.createTask)

// @route   GET api/tasks/
// @desc    Get tasks by user
router.get('/', checkAuth, taskController.getAllUserTasks)

export default router