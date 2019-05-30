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
            tags: ['api', 'GET'],
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
        config: {
            tags: ['api', 'GET'],
            description: 'Lista uma ferramentas do banco',
            notes: 'É possível pegar uma ferramenta do banco filtrando por ID',
        },
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
        config: {
            tags: ['api', 'POST'],
            description: 'Cadastra uma nova ferramenta',
            notes: 'Cadastra uma ferramenta no banco passando os Título, link, descrição e tags',
        },
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
        config: {
            tags: ['api', 'PATCH'],
            description: 'Atualiza uma ferramenta do banco',
            notes: 'Atualiza um ou mais campos do item especificado',
        },
        handler: async (request, response) => {
            try {
                const { id } = request.params;

                const stringData = JSON.stringify(request.payload);
                const data = JSON.parse(stringData);

                const result = await context.update(id, data);
                if (result.statusCode !== 200) return {};

                return {
                    _id: result._id,
                    statusCode: result.statusCode,
                    message: 'Done!'
                };
            } catch (error) {
                console.error('DEU RUIM', error);
                return;
            }
        }
    });

    app.route({
        method: 'DELETE',
        path: '/tools/{id}',
        config: {
            tags: ['api', 'DELETE'],
            description: 'Deleta uma ferramenta do banco',
            notes: 'É possível deletar uma ferramenta do banco passando o ID, ou todas as ferramentas do banco quando não existe critério',
        },
        handler: async (request, response) => {
            try {
                const { id } = request.params ? request.params : {};

                const result = await context.delete(id);
                if (result.statusCode !== 200) return {};

                return {
                    statusCode: result.statusCode,
                    message: 'Done!'
                };
            } catch (error) {
                console.error('DEU RUIM', error);
                return;
            }
        }
    });
    app.route({
        method: 'DELETE',
        path: '/tools',
        config: {
            tags: ['api', 'DELETE'],
            description: 'Deleta todas as ferramentas do banco',
            notes: 'É possível deletar todas as ferramentas do banco',
        },
        handler: async (request, response) => {
            try {
                const result = await context.delete();
                if (result.statusCode !== 200) return {};

                return {
                    statusCode: result.statusCode,
                    message: 'Done!'
                };
            } catch (error) {
                console.error('DEU RUIM', error);
                return;
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