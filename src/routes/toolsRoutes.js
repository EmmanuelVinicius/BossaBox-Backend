const BaseRoute = require('./base/baseRoute');

const Joi = require('joi');
const Boom = require('boom');

const failAction = (request, headers, erro) => {
    console.log('failAction Log', erro);
    throw erro;
}

class ToolsRoutes extends BaseRoute {
    constructor(context) {
        super();
        this._context = context;
    }
    list() {
        return {
            method: 'GET',
            path: '/tools',
            config: {
                tags: ['api', 'GET'],
                description: 'Lista as ferramentas do banco',
                notes: 'É possível pegar todas ferramentas do banco e filtrar por algum critério',
                validate: {
                    failAction,
                    query: {
                        title: Joi.string().min(3).max(100),
                        link: Joi.string().min(3).max(100),
                        description: Joi.string().min(3).max(100),
                        tags: Joi.string()
                    }
                }
            },
            handler: async (request, response) => {
                try {
                    const stringData = JSON.stringify(request.query);
                    const data = JSON.parse(stringData);

                    return await this._context.read(data);
                } catch (error) {
                    console.error('DEU RUIM', error)
                    return Boom.internal('Erro interno do servidor');
                }
            }
        }
    }
    listOne() {
        return {
            method: 'GET',
            path: '/tools/{id}',
            config: {
                tags: ['api', 'GET'],
                description: 'Lista uma ferramentas do banco',
                notes: 'É possível pegar uma ferramenta do banco filtrando por ID',
                validate: {
                    failAction,
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request, response) => {
                try {
                    const id = request.params;

                    return await this._context.read(id);
                } catch (error) {
                    console.error('DEU RUIM', error);
                    return Boom.internal('Erro interno do servidor');
                }
            }
        }
    }
    create() {
        return {
            method: 'POST',
            path: '/tools',
            config: {
                tags: ['api', 'POST'],
                description: 'Cadastra uma nova ferramenta',
                notes: 'Cadastra uma ferramenta no banco passando os Título, link, descrição e tags',
                validate: {
                    failAction,
                    payload: {
                        title: Joi.string().required().min(3).max(100),
                        link: Joi.string().min(3).max(100),
                        description: Joi.string().required().min(3).max(100),
                        tags: Joi.array().items(Joi.string()).required()
                    }
                }
            },
            handler: async (request, response) => {
                try {
                    const data = request.payload;
                    const result = await this._context.create(data);

                    return {
                        message: 'Done!',
                        _id: result._id
                    };

                } catch (error) {
                    console.error('DEU RUIM', error);
                    return Boom.internal('Erro interno do servidor');
                }
            }
        }
    }
    update() {
        return {
            method: 'PATCH',
            path: '/tools/{id}',
            config: {
                tags: ['api', 'PATCH'],
                description: 'Atualiza uma ferramenta do banco',
                notes: 'Atualiza um ou mais campos do item especificado',
                validate: {
                    failAction,
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        title: Joi.string().min(3).max(100),
                        link: Joi.string().min(3).max(100),
                        description: Joi.string().min(3).max(100),
                        tags: Joi.array().items(Joi.string())
                    }
                }
            },
            handler: async (request, response) => {
                try {
                    const { id } = request.params;
                    
                    const stringData = JSON.stringify(request.payload);
                    const data = JSON.parse(stringData);
                    
                    const result = await this._context.update(id, data);
                    if (result.nModified !== 1) return Boom.preconditionFailed('As condiçoes precisam ser atendidas corretamente');

                    return {
                        _id: result._id,
                        statusCode: result.statusCode,
                        message: 'Done!'
                    };
                } catch (error) {
                    console.error('DEU RUIM', error);
                    return Boom.internal('Erro interno do servidor');
                }
            }
        }
    }
    deleteOne() {
        return {
            method: 'DELETE',
            path: '/tools/{id}',
            config: {
                tags: ['api', 'DELETE'],
                description: 'Deleta uma ferramenta do banco',
                notes: 'É possível deletar uma ferramenta do banco passando o ID',
                validate: {
                    failAction,
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request, response) => {
                try {
                    const { id } = request.params;

                    const result = await this._context.delete(id)
                    if (result.n !== 1) return Boom.preconditionFailed('As condiçoes precisam ser atendidas corretamente');

                    return {
                        ok: result.ok,
                        message: 'Done!'
                    };
                } catch (error) {
                    console.error('DEU RUIM', error);
                    return Boom.internal('Erro interno do servidor');
                }
            }
        }
    }
    deleteAll() {
        return {
            method: 'DELETE',
            path: '/tools',
            config: {
                tags: ['api', 'DELETE'],
                description: 'Deleta todas as ferramentas do banco',
                notes: 'É possível deletar todas as ferramentas do banco',
                validate: {
                    failAction
                }
            },
            handler: async () => {
                try {
                    const result = await this._context.delete();

                    if (result.n !== 1) return Boom.preconditionFailed('As condiçoes precisam ser atendidas corretamente');

                    return {
                        statusCode: result.statusCode,
                        message: 'Done!'
                    };
                } catch (error) {
                    console.error('DEU RUIM', error);
                    return Boom.internal('Erro interno do servidor');
                }
            }
        }
    }
}

module.exports = ToolsRoutes;