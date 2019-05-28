const Hapi = require('hapi');

const Swagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');

const Auth = require('hapi-auth-jwt2');

const app = new Hapi.Server({ port: 3000 });

const MOCK_ITEMS = [
    { id: 1, title: 'primeiro', tag: 'node' },
    { id: 2, title: 'segundo', tag: 'mocha' },
    { id: 3, title: 'terceiro', tag: 'node' },
    { id: 4, title: 'quarto', tag: 'mocha' }
];

async function Api() {

    const swaggerOptions = {
        info: {
            title: 'Desafio de entrada BossaBox',
            version: 'v1.0'
        },
        lang: 'pt'
    };

    await app.register([
        HapiAuthJwt2,
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
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
            validate: {
                failAction,
                headers,
                query: {
                    skip: Joi.number().integer().default(0),
                    limit: Joi.number().integer().default(10),
                    nome: Joi.string().min(3).max(100)
                },
            },
        handler: (request, response) => {
            try {
                const consulta = request.query.tag ? MOCK_ITEMS.filter(result => result.tag == request.query.tag) : MOCK_ITEMS;
                return consulta;
            } catch (error) {
                console.error('DEU RUIM', error)
                return;
            }
        }
    });
    app.route({
        method: 'GET',
        path: '/tools/{id}',
        handler: (request, response) => {
            try {
                const consulta = MOCK_ITEMS.filter(result => result.id == request.params.id);
                return consulta;
            } catch (error) {
                console.error('DEU RUIM', error);
                return;
            }
        }
    });
    app.route({
        method: 'POST',
        path: '/tools',
        handler: (request, response) => {
            try {
                let insertion = [];
                const data = request.payload;
                insertion.push(data);
                return insertion;

            } catch (error) {
                console.error('DEU RUIM', error);
                return;
            }
        }
    });
    app.route({
        method: 'PATCH',
        path: '/tools/{id}',
        handler: (request, response) => {
            try {
                const [consulta] = MOCK_ITEMS.filter(result => result.id == request.params.id);
                for (let key in request.payload)
                    consulta[key] = request.payload[key];

                return consulta.id;

            } catch (error) {
                console.error('DEU RUIM', error);
                return;
            }
        }
    });

    app.route({
        method: 'DELETE',
        path: '/tools/{id}',
        handler: (request, response) => {
            try {
                const consulta = (result) => result.id == request.params.id;
                const index = MOCK_ITEMS.findIndex(consulta);
                MOCK_ITEMS.splice(index, 1);

                return JSON.stringify(MOCK_ITEMS.indexOf(consulta));
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