const express = require("express");
const router = express.Router();
const Offers = require('../models/Offers');
const Users = require("../models/Users");

//! fetch all offers from db and send it to client

router.get('/offer', async(req, res)=>{
    try {
        const offersData = await Offers.find();
        return res.send(offersData);
    } catch (error) {
        console.log(error);
    }
})

//! Save new offer to db
router.post('/offer', async(req, res)=>{
    try {
        const newOffer = new Offers({
            sellerID: req.body.newOfferData.sellerID,
            sellerName: req.body.newOfferData.sellerName,
            sellCurrency: req.body.newOfferData.sellCurrency,
            buyCurrency: req.body.newOfferData.buyCurrency,
            sellRate: req.body.newOfferData.sellRate,
            sellAmount: req.body.newOfferData.sellAmount,
        })
        console.log(newOffer);
        await newOffer.save();
        return res.send('offer Saved');
    } catch (error) {
        console.log(error);
    }
})

//! Delete accepted offer and update the transaction in db
router.patch('/offer', async(req, res)=>{
    try {
        await Offers.findByIdAndDelete(req.body.offerData._id);
        const buyerData = await Users.findById(req.body.offerData.buyerId)
        const sellerData = await Users.findById(req.body.offerData.sellerID)
        // console.log(buyerData)
        // console.log(sellerData)
        // console.log(req.body.offerData)

        const sellCurrency = req.body.offerData.sellCurrency;
        const buyCurrency = req.body.offerData.buyCurrency;
        const buyerAddedCurrencyBalance = (buyerData.balance[sellCurrency])+(req.body.offerData.sellAmount);
        const buyerSoldCurrencyBalance = (buyerData.balance[buyCurrency]) - ((req.body.offerData.sellAmount)*(req.body.offerData.sellRate));

        const sellerAddedCurrencyBalance = (sellerData.balance[buyCurrency]) + ((req.body.offerData.sellAmount)*(req.body.offerData.sellRate));
        const sellerSoldCurrencyBalance = (sellerData.balance[sellCurrency])- (req.body.offerData.sellAmount);

        buyerData.balance[sellCurrency] = buyerAddedCurrencyBalance;
        buyerData.balance[buyCurrency] = buyerSoldCurrencyBalance;
        sellerData.balance[buyCurrency] = sellerAddedCurrencyBalance;
        sellerData.balance[sellCurrency] = sellerSoldCurrencyBalance;

        await buyerData.save();
        await sellerData.save();

        //* Updating transaction
        const buyerTransactions = {
            [sellCurrency]: `+${req.body.offerData.sellAmount}`,
        }
        const buyerDeductedAmount = (req.body.offerData.sellAmount)*(req.body.offerData.sellRate)
        const buyerTransactions2 = {
            [buyCurrency]: `-${buyerDeductedAmount}`,
        }
        buyerData.transactions.push(buyerTransactions);
        buyerData.transactions.push(buyerTransactions2);
        await buyerData.save();

        //seller transactions
        const sellerTransactions = {
            [sellCurrency]: `-${req.body.offerData.sellAmount}`,
        }
        const sellerAddedAmount = (req.body.offerData.sellAmount)*(req.body.offerData.sellRate)
        const sellerTransactions2 = {
            [buyCurrency]: `+${sellerAddedAmount}`,
        }
        sellerData.transactions.push(sellerTransactions);
        sellerData.transactions.push(sellerTransactions2);
        await sellerData.save();

        return res.send('offer Accepted');
    } catch (error) {
        console.log(error);
    }
})



module.exports = router;