const request = require('supertest')
const app = require('../../app')
const { mongoConnect, mongoDisconnect } = require('../../services/mongo')

describe('GET /planets test', () => {
    beforeAll(async () => {
        await mongoConnect()
    })

    afterAll(async () => {
        await mongoDisconnect()
    })

    test('should respond with 200 success', async () => {
        await request(app)
        .get('/planets')
        .expect(200)
    })
})