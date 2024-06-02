const request = require('supertest')
const app = require('../../app')

describe('GET /planets test', () => {
    test('should respond with 200 success', async () => {
        await request(app)
        .get('/planets')
        .expect(200)
    })
})