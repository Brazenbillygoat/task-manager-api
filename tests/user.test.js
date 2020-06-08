const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

// test('Should sign up a new user', async () => {
//     const response = await request(app).post('/users').send({
//         name: 'andrew',
//         email: 'andrew@example.com',
//         password: 'MyPass777!'
//     }).expect(201)

//     // Assert that the database was changed correctly
//     const user = await User.findById(response.body.user._id)
//     expect(user).not.toBeNull()

//     // Assertions about the response
//     expect(response.body).toMatchObject({
//         user: {
//             name: 'andrew',
//             email: 'andrew@example.com',
//         },
//         token: user.tokens[0].token
//     })
//     expect(user.password).not.toBe('MyPass777!')
// })

// test('Should login existing user', async () => {
//     const response = await request(app).post('/users/login').send({
//         email: userOne.email,
//         password: userOne.password
//     }).expect(200)

//     const user = await User.findById(response.body.user._id)
//     expect(response.body.token)
//     .toBe(user.tokens[1].token)
// })

// test('Should not login nonexisting user', async () => {
//     await request(app).post('/users/login').send().expect(400)
// })

// test('Should get profile for user', async () => {
//     await request(app)
//         .get('/users/me')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .send()
//         .expect(200)
// })

// test('Test should not get profile for unathenticated user', async () => {
//     await request(app)
//         .get('/users/me')
//         .send()
//         .expect(401)
// })

// test('Should delete account for user', async () => {
//     await request(app)
//         .delete('/users/me')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .send()
//         .expect(200)

//     const user = await User.findById(userOneId)
//     expect(user).toBeNull()
// })

// test('Should not delete account for unathenticated user', async () => {
//     await request(app)
//     .delete('/users/me')
//     .send()
//     .expect(401)
// })

// test('Should upload avatar image', async () => {
//     await request(app)
//         .post('/users/me/avatar')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .attach('avatar', 'tests/fixtures/profile-pic.jpg')
//         .expect(200)
//     const user = await User.findById(userOneId)
//     expect(user.avatar).toEqual(expect.any(Buffer))   
// })

// test('Should update valid user fields', async () => {
//     await request(app)
//         .patch('/users/me')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .send({
//             name: 'Mike'
//         })
//         .expect(200)
//         const user = await User.findById(userOneId)
//         expect(user.name).toEqual('Mike')
// })

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Niagra Falls'
        })
        .expect(400)
})