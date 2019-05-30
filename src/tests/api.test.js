const assert = require('assert');
const api = require('../api');


const MOCK_QUERY = 'tags=calendar';
let MOCK_ID = '';
const MOCK_ITEM_DEFAULT = {
    "title": "Notion",
    "link": "https://notion.so",
    "description": "All in one tool to organize teams and ideas. Write, plan, collaborate, and get organized. ",
    "tags": [
        "organization",
        "planning",
        "collaboration",
        "writing",
        "calendar"
    ]
};

describe('Test suit of all tools', function () {
    this.timeout(Infinity)
    this.beforeAll(async () => {
        app = await api;
        const result = await app.inject({
            method: 'POST',
            url: '/tools',
            payload: JSON.stringify(MOCK_ITEM_DEFAULT)
        });
        const { _id } = JSON.parse(result.payload);
        MOCK_ID = _id;
    })
    it('Get all tools', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/tools'
        });
        const data = JSON.parse(result.payload);
        assert.ok(Array.isArray(data));
    });
    it('Get tools with query', async () => {
        const result = await app.inject({
            method: 'GET',
            url: `/tools?${MOCK_QUERY}`
        });

        const [{ tags }] = JSON.parse(result.payload);
        assert.deepStrictEqual(tags, MOCK_ITEM_DEFAULT.tags);
    });
    it('Get tool by Id', async () => {
        const result = await app.inject({
            method: 'GET',
            url: `/tools/${MOCK_ID}`
        });

        const { _id } = JSON.parse(result.payload);
        assert.deepStrictEqual(_id, MOCK_ID);
    });
    it('Create a tool', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/tools',
            payload: MOCK_ITEM_DEFAULT
        });

        const { message } = JSON.parse(result.payload);

        assert.ok(message === 'Done!');
    });
    it('Update a tool', async () => {
        const newItem = { title: `newItem - ${Date.now()}` }
        const result = await app.inject({
            method: 'PATCH',
            url: `/tools/${MOCK_ID}`,
            payload: newItem
        });

        const statusCode = result.statusCode;
        assert.ok(statusCode === 200);
    });
    it('Delete tool', async () => {
        const result = await app.inject({
            method: 'DELETE',
            url: `/tools/${MOCK_ID}`
        });

        const { ok } = JSON.parse(result.payload)
        assert.ok(ok === 1);
    });
    it('Delete all tools', async () => {
        const result = await app.inject({
            method: 'DELETE',
            url: `/tools`
        });

        const statusCode = result.statusCode;
        assert.ok(statusCode === 200);
    });
})