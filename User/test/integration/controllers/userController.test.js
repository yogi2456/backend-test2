const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../../../index');


describe('Integration Testing: CreateUser Controller', () => {

    it('should handle errors', async () => {
        const requestBody = {
            username: 'testuser',
            email: 'test@example.com',
            type: 'regular',
            adminId: '6571a707362599a503c76633',
        };

        const response = await supertest(app)
            .post('/createUser')
            .send(requestBody);

        console.log('Actual Response:', response.status, response.body);

        expect(response.status).to.equal(401);
        expect(response.body.success).to.equal(false);
        expect(response.body.error).to.equal('Admin is wrong.');
    });
});