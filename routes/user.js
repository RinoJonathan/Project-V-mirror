const mongoose = require('mongoose')
const passportMongo = require('passport-local-mongoose')

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

userSchema.plugin(passportMongo)

module.exports = mongoose.models('user', userSchema)