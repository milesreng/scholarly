import express from 'express'
import { checkAuth, checkAdmin } from '../middleware/checkAuth'
import { projectController } from '../controllers/project.controller'

const router = express.Router()


// @route   GET api/project/:id/tasks
// @desc    Get tasks by project id
router.get('/:id/tasks', checkAuth, projectController.getTasksByProject)

// @route   GET api/project/:id/users
// @desc    Get users by project id
router.get('/:id/users', checkAuth, projectController.getUsersByProject)

// @route   DELETE api/project/:id
// @desc    Delete project
router.delete('/:id', checkAuth, projectController.deleteProject)

// @route   GET api/project/:id
// @desc    Get project by id
router.get('/:id', checkAuth, projectController.getProjectById)

// @route   POST api/project/
// @desc    Create new project
router.post('/', checkAuth, projectController.createProject)

// @route   GET api/project/
// @desc    Get project by id
router.get('/', checkAuth, checkAdmin, projectController.getAllProjects)

export default router