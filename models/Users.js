const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
})

const Users = mongoose.model('users', userSchema);
module.exports = Users;