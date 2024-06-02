const request = require('supertest')
const app = require('../../app')

describe('GET /launches test', () => {
    test('should respond with 200 success', async () => {
        await request(app)
            .get('/launches')
            .expect(200)
    })
})