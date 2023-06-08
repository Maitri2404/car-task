const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    iUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    iSellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller'
    },
    iCarId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car'
    }
})

module.exports = mongoose.model('Transaction', transactionSchema)