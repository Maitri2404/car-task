const mongoose = require('mongoose')
const carSchema = new mongoose.Schema({
    sCarName:String,
    // nYear: Number,
    iBrandId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },
    isSold:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model( 'Car', carSchema )