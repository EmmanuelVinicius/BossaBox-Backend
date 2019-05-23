const assert = require('assert');
const api = require('../api');


const MOCK_QUERY = 'tag=node';
const MOCK_TAG = 'node';

describe('Test suit of all tools', function () {
    this.beforeAll(async () =>{
        app = await api;
    })
    it('Get all tools', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/tools'
        });
        const data = JSON.parse(result.payload);

        assert.ok(Array.isArray(data));
    });
    it('Get all tools with query', async () => {
        const result = await app.inject({
            method: 'GET',
            url: `/tools?${MOCK_QUERY}`
        });

        const [{ tag }] = JSON.parse(result.payload);
        assert.deepStrictEqual(tag, MOCK_TAG);
    })
})