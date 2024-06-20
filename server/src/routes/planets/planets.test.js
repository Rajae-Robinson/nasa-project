const request = require('supertest')
const app = require('../../app')
const { mongoConnectTestDB, mongoDisconnect } = require('../../config/mongo')

describe('GET /planets test', () => {
    beforeAll(async () => {
        await mongoConnectTestDB()
    })

    afterAll(async () => {
        await mongoDisconnect()
    })

    test('should respond with 200 success', async () => {
        await request(app)
        .get('/v1/planets')
        .expect(200)
    })
})