const request = require('supertest');
const app = require('../app');

/**
 * Helper function to authenticate and get token
*/
async function getAuthToken() {
    const response = await request(app)
        .post('/v1/auth/login') 
        .send({
            email: process.env.TEST_EMAIL,
            password: process.env.TEST_PASS
        })
        .expect(200);
    
    return response.body.token;
}

module.exports = {
    getAuthToken
};
