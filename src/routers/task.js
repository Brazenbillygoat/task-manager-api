const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const Task = require('../models/task')

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = [ 'description', 'completed' ]
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid updates, key to be updated does not exist.' })
    }

    try {
        const _id = req.params.id

        const task = await Task.findOne({_id: _id, owner: req.user._id})

        //const task = await Task.findByIdAndUpdate( req.params.id, req.body, { new: true, runValidators: true })

        if(!task) {
            return res.status(404).send('This id does not match any id in the database.')
        }
        updates.forEach((update) => task[update] = req.body[update])

        await task.save()
        res.status(201).send(task)

    } catch (e) {
        res.status(400).send('There is no task with that id. Make sure you have copied the id correctly.')
    }
})

//GET /tasks?completed=false
//GET /tasks?limit=10&skip=0
//GET /tasks?sortBy=createdAt_desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    
    if (req.query.sortBy) {

        // tutorials solution
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        
        // // My solution commented out below
        // if (req.query.sortBy === 'createdAt_asc') {
        //     sort.createdAt = 1
        // } else {
        //     sort.createdAt = -1
        // }

    }

    try {
        console.log(req.user)
        //both lines below do the same thing
        //const task = await Task.find({ owner: req.user._id})
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        
        res.status(200).send(req.user.tasks)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send('This id does not match any id in the database.')
        }
        return res.status(200).send(task)
    } catch (e) {
         return res.status(404).send('There is no task with that id. Make sure you have copied the id correctly.')
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        if (!task) {
            return res.status(404).send('This id does not match any id in the database.')
        }

         return res.status(200).send(task)
    } catch (e) {
        return res.status(500).send('There is no task with that id. Make sure you have copied the id correctly.')
    }
})

module.exports = router