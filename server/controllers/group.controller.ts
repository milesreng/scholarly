import { Request, Response } from 'express'
import { User } from '../models/user.model'
import { Group } from '../models/group.model'

export const groupController = {
  getGroupDetails: async (req: Request, res: Response) => {
    try {
      const groupId = req.params.id

      const group = await Group.findById(groupId)

      if (!group) {
        return res.status(404).json({ message: 'group not found' })  
      }

      return res.status(200).json(group)
      
    } catch (error) {
      console.log(error)
      res.status(400).json(error)
    }
  },
  createGroup: async (req: Request, res: Response) => {
    try {
      const group = req.body

      const owner = await User.findById(group.owner)

      if (!owner) {
        return res.status(404).json({ message: 'owner not found' })
      }

      const newGroup = new Group({
        name: group.name,
        description: group.description,
        owner,
        members: [],
        tasks: []
      })

      await newGroup.save()

      return res.status(200).json(newGroup)

    } catch (error) {
      console.log(error)
      res.status(400).json(error)
    }
  },
}