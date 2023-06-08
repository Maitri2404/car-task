const mongoose = require('mongoose')

const brandSchema = new mongoose.Schema({
    sBrand: String
})

module.exports = mongoose.model('Brand',brandSchema)