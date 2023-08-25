const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    balance: {
        INR: {
            type: Number,
            default: 0
        },
        EUR: {
            type: Number,
            default: 0
        },
        USD: {
            type: Number,
            default: 0
        },
    },
    transactions: Array,
    isAdmin: {
        type: Boolean,
        default: false
    }
})

const Users = mongoose.model('users', userSchema);
module.exports = Users;