const Hapi = require('hapi');
const Joi = require('joi');

const Swagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');

const Auth = require('hapi-auth-jwt2');

const app = new Hapi.Server({ port: 3000 });

const MOCK_ITEMS = [
    { title: 'primeiro', tag: 'node' },
    { title: 'segundo', tag: 'mocha' },
    { title: 'terceiro', tag: 'node' },
    { title: 'quarto', tag: 'mocha' }
];

async function Api() {
    app.route({
        method: 'GET',
        path: '/tools',
        config: {
            validate: {
                query: {
                    tag: Joi.string().min(3).max(30)
                }
            }
        },
        handler: (request, response) => {

            const consulta = request.query.tag ? MOCK_ITEMS.filter(tag => tag.tag == request.query.tag) : MOCK_ITEMS;
            return consulta;
        }
    });

    await app.start();
    console.log(`Tô na porta ${app.info.port}`)
    process.on('unhandledRejection', (err) => {
        console.log(err);
        process.exit(1);
    });
    return app;
}

module.exports = Api();