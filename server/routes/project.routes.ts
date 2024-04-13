import express from 'express'
import { checkAuth } from '../middleware/checkAuth'
import { projectController } from '../controllers/project.controller'

const router = express.Router()


// @route   GET api/project/:id/tasks
// @desc    Get tasks by project id
router.get('/:id/tasks', checkAuth, projectController.getTasksByProject)

// @route   GET api/project/:id
// @desc    Get project by id
router.get('/:id', checkAuth, projectController.getProjectById)

export default router