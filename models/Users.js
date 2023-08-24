const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    balance: {
        INR: Number,
        EUR: Number,
        USD: Number,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

const Users = mongoose.model('users', userSchema);
module.exports = Users;