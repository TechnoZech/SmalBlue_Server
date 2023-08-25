const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    sellerID: String,
    sellerName: String,
    buyCurrency: String,
    sellCurrency: String,
    sellRate: Number,
    sellAmount: Number,
})

const Offers = mongoose.model('offers', offerSchema);
module.exports = Offers;