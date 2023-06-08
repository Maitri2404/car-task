const mongoose = require('mongoose')

const sellerSchema = new mongoose.Schema({
    sSellerName: String,
    sSellerCity: String,
    iCarId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car'
    }]
})

module.exports = mongoose.model('Seller',sellerSchema)