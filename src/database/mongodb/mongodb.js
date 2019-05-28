const Mongoose = require('mongoose');

class MongoDb {
    constructor(connection, schema) {
        this._connection = connection;
        this._schema = schema;
    }
    static connect() {
        Mongoose.connect('mongodb+srv://emmanuel:emmanuel@pessoas-e2ext.mongodb.net/test?retryWrites=true',
            { useNewUrlParser: true }, function (error) {
                if (!error) return;
                console.log("Erro de conexão com o banco", error);
            })

        const connection = Mongoose.connection;

        connection.once('open', async () => console.log('Conectado'));
        return connection;
    }

    async isConected() {
        const state = this._connection.readyState;
        if (state === 1) return state;

        if (state !== 2) return state;
        await new Promise(resolve => setTimeout(resolve, 1000))

        return this._connection.readyState;
    }
    create(item) {
        return this._schema.create(item);
    }
    read(query) {
        const result = query.id ? this._schema.findById(query.id) :
            this._schema.find(query);

        return result;
    }
    update(_id, item) {
        return this._schema.updateOne({ _id }, { $set: item });
    }
    delete(_id) {
        return this._schema.deleteOne({ _id });
    }
}

module.exports = MongoDb;