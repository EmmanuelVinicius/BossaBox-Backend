const assert = require('assert');
const ToolsSchema = require('./../database/mongodb/schemas/toolsSchema');
const MongoDb = require('./../database/mongodb/mongodb');

const MOCK_DEFAULT_ITEM = {
    title: `Notion - ${Date.now()}`,
    link: "https://notion.so",
    description: "All in one tool to organize teams and ideas. Write, plan, collaborate, and get organized. ",
    tags: [
        "organization",
        "planning",
        "collaboration",
        "writing",
        "calendar"
    ]
}

let baseTool = '';

describe('MongoDb test suit', function () {
    this.timeout(4000);
    this.beforeAll(async () => {
        const connection = MongoDb.connect();
        context = new MongoDb(connection, ToolsSchema);

        baseTool = await context.create(MOCK_DEFAULT_ITEM);
    });
    this.afterAll(async () => {
        await context.delete(baseTool._id);
    });

    it('Verify the mongo connection', async () => {
        const result = await context.isConected();

        assert.ok(result === 1 || result === 2);
    });
    it('Create a test tool', async () => {
        const { title } = await context.create(MOCK_DEFAULT_ITEM);

        assert.deepStrictEqual(title, MOCK_DEFAULT_ITEM.title);
    });
    it('Read the tools', async () => {
        const [{ title }] = await context.read({ title: MOCK_DEFAULT_ITEM.title });

        assert.deepStrictEqual(title, MOCK_DEFAULT_ITEM.title);
    })
    it('Update any field of a tool by ID', async () => {
        const result = await context.update(baseTool._id, { title: 'noitoN' });

        assert.deepStrictEqual(result.nModified, 1);
    });
    it('Delete a tool by ID', async () => {
        const result = await context.delete(baseTool._id);

        assert.deepStrictEqual(result.n, 1);
    });
    it('Clear all tools', async () => {
        const result = await context.delete();
        
        assert.ok(result.ok === 1)
    });
})