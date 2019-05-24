const assert = require('assert');
const api = require('../api');


const MOCK_QUERY = 'tag=node';
const MOCK_ITEM_DEFAULT = { id: 1, title: 'primeiro', tag: 'node' };

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
    it('Get tools with query', async () => {
        const result = await app.inject({
            method: 'GET',
            url: `/tools?${MOCK_QUERY}`
        });

        const [{ tag }] = JSON.parse(result.payload);
        assert.deepStrictEqual(tag, MOCK_ITEM_DEFAULT.tag);
    });
    it('Get tool by Id', async () => {
        const result = await app.inject({
            method: 'GET',
            url: `/tools/${MOCK_ITEM_DEFAULT.id}`
        });

        const [{ id }] = JSON.parse(result.payload);
        assert.deepStrictEqual(id, MOCK_ITEM_DEFAULT.id);
    });
    it('Create a tool', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/tools',
            payload: MOCK_ITEM_DEFAULT
        });

        const [{id}] = JSON.parse(result.payload);
        assert.deepStrictEqual(id, MOCK_ITEM_DEFAULT.id);
    });
    it('Update a tool', async () => {
        const newItem = { title: 'novoPrimeiro' }
        const result = await app.inject({
            method: 'PATCH',
            url: `/tools/${MOCK_ITEM_DEFAULT.id}`,
            payload: JSON.stringify(newItem)
        });

        const dados = JSON.parse(result.payload);
        assert.deepStrictEqual(dados, MOCK_ITEM_DEFAULT.id);
    });
    it('Delete tool', async () => {
        const result = await app.inject({
            method: 'DELETE',
            url: `/tools/${MOCK_ITEM_DEFAULT.id}`
        });

        const dados = JSON.parse(result.payload);
        assert.ok(dados === -1);
    });
})