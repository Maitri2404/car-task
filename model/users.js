const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    sUserName: String,
    // sEmail: String,
    sUserCity: String,
    sRole: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
        // type: Boolean,
        // default: false
      }
})

module.exports = mongoose.model('User',userSchema);