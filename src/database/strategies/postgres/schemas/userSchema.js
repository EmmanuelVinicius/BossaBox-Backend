const Sequelize = require('sequelize');

const userSchema = {
    name: 'Users',
    schema: {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true
        },
        userrole:{
            type: Sequelize.STRING,
            required: true,
        },
        email:{
            type: Sequelize.STRING,
            unique: true,
            required: true,
        },
        senha: {
            type: Sequelize.STRING,
            required: true
        }
    },
    options: {
        tableName: 'Users',
        freezeTableName: false,
        timestamps: false
    }
}

module.exports = userSchema;