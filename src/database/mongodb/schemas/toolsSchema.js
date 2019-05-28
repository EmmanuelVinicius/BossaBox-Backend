const Mongoose = require('mongoose')

const toolsSchema = new Mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    link: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    tags: [{
        type: String
    }],
    insertedAt: {
        type: Date,
        default: new Date()
    }

})
module.exports = Mongoose.model('Tools', toolsSchema)