const mongoose = require('mongoose')
const passportMongo = require('passport-local-mongoose')
const findOrCreate = require("mongoose-findorcreate")

const userSchema = mongoose.Schema({
    googleId: String,
    email: {
        type: String,
        required: true,
        unique: true
    }

})

userSchema.plugin(passportMongo)
userSchema.plugin(findOrCreate)

// Method to find or create a user based on Google profile
// userSchema.statics.findOrCreate = function (profile) {
//     return this.findOne({ googleId: profile.id })
//         .then((user) => {
//             if (user) {
//                 return user;
//             } else {
//                 return this.create({
//                     googleId: profile.id,
//                     email: profile.emails[0].value, // Store the first email in the profile
//                     // You may want to add more fields from the Google profile here
//                 });
//             }
//         })
//         .catch((error) => {
//             throw error;
//         });
// };

module.exports = mongoose.model('user', userSchema)