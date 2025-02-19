const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {
    userOneId,
    userOne,
    setupDatabase,
    userTwoId,
    userTwo,
    taskOne

} = require('./fixtures/db')

beforeEach(setupDatabase)

// test('Should create task for user', async () => {
//     const response = await request(app)
//         .post('/tasks')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .send({
//             description: 'From my test.'
//         })
//         .expect(201)
//         const task = await Task.findById(response.body._id)
//         expect(task).not.toBeNull()
//         expect(task.completed).toEqual(false)
// })

// test('Should get all tasks for userOne', async () => {
//     const response = await request(app)
//         .get('/tasks')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .send()
//         .expect(200)
//         await expect(response.body.length).toBe(2)
// })

test('Should not delete other users tasks', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
        const task = await Task.findById(taskOne._id)
        expect(task).not.toBeNull()
})

test('Should fetch user task by id', async () => {
    await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not fetch user tasks if not authorized', async () => {
    const response = await request(app)
        .get('/tasks')
        .send()
        .expect(401)
        expect(response.body).toEqual({error: 'Please authenticate'})
})
