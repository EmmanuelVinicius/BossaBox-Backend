const Hapi = require('hapi');
const MongoDb = require('./database/mongodb/mongodb');
const ToolsSchema = require('./database/mongodb/schemas/toolsSchema');

const Swagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');
const Auth = require('hapi-auth-jwt2');

const app = new Hapi.Server({ port: 3000 });

async function Api() {
    const connection = MongoDb.connect();
    const context = new MongoDb(connection, ToolsSchema);

    const swaggerOptions = {
        info: {
            title: 'Desafio de entrada BossaBox',
            version: 'v1.0'
        },
        lang: 'pt'
    };

    await app.register([
        Auth,
        Vision,
        Inert,
        {
            plugin: Swagger,
            options: swaggerOptions
        }
    ]);

    app.route({
        method: 'GET',
        path: '/tools',
        config: {
            tags: ['api'],
            description: 'Lista as ferramentas do banco',
            notes: 'É possível pegar todas ferramentas do banco e filtrar por algum critério',
        },
        handler: async (request, response) => {
            try {
                const stringData = JSON.stringify(request.query);
                const data = JSON.parse(stringData);

                return await context.read(data);
            } catch (error) {
                console.error('DEU RUIM', error)
                return;
            }
        }
    });
    app.route({
        method: 'GET',
        path: '/tools/{id}',
        handler: async (request, response) => {
            try {
                const id = request.params

                return await context.read(id);
            } catch (error) {
                console.error('DEU RUIM', error);
                return;
            }
        }
    });
    app.route({
        method: 'POST',
        path: '/tools',
        handler: async (request, response) => {
            try {
                const data = request.payload;
                const result = await context.create(data);

                return {
                    message: 'Done!',
                    _id: result._id
                };

            } catch (error) {
                console.error('DEU RUIM', error);
                return;
            }
        }
    });
    app.route({
        method: 'PATCH',
        path: '/tools/{id}',
        handler: async (request, response) => {
            try {
                const { id } = request.params;

                const stringData = JSON.stringify(request.payload);
                const data = JSON.parse(stringData);

                const result = await context.update(id, data);
                if (result.statusCode !== 200) return {};

                return result.statusCode;
            } catch (error) {
                console.error('DEU RUIM', error);
                return;
            }
        }
    });

    app.route({
        method: 'DELETE',
        path: '/tools/{id}',
        handler: async (request, response) => {
            try {
                const { id } = request.params

                const result = await context.delete(id);
                if (result.statusCode !== 200) return {};

                return result.statusCode;
            } catch (error) {
                console.error('DEU RUIM', error);

            }
        }
    })

    await app.start();
    console.log(`Tô na porta ${app.info.port}`)
    process.on('unhandledRejection', (error) => {
        console.log('FAIL', error);
        process.exit(1);
    });
    return app;
}

module.exports = Api();