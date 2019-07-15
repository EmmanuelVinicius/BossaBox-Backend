const Hapi = require('hapi');
const MongoDb = require('./database/mongodb/mongodb');
const ToolsSchema = require('./database/mongodb/schemas/toolsSchema');
const ToolsRoutes = require('./routes/toolsRoutes');

const Swagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');

const app = new Hapi.Server({ port: 3001 });

mapRoutes = (instance, methods) => {
    return methods.map(method => instance[method]())
}
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
        Vision,
        Inert,
        {
            plugin: Swagger,
            options: swaggerOptions
        }
    ]);

    app.route(
        mapRoutes(new ToolsRoutes(context), ToolsRoutes.methods())
    );

    await app.start();
    console.log(`Tô na porta ${app.info.port}`)
    process.on('unhandledRejection', (error) => {
        console.log('FAIL', error);
        process.exit(1);
    });
    return app;
}

module.exports = Api();