import express from 'express'
import { groupController } from '../controllers/group.controller'

const router = express.Router()

// @route   POST api/groups/
// @desc    Create new group
router.post('/', groupController.createGroup)

// @route   GET api/groups/:id
// @desc    Get group details
router.get('/:id', groupController.getGroupDetails)

export default router