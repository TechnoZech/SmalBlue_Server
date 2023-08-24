const express = require("express");
const router = express.Router();
const Offers = require('../models/Offers');


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
        console.log(req.body.newOfferData);
        const newOffer = new Offers({
            userID: req.body.newOfferData.userID,
            userName: req.body.newOfferData.userName,
            sellCurrency: req.body.newOfferData.sellCurrency,
            buyCurrency: req.body.newOfferData.buyCurrency,
            sellRate: req.body.newOfferData.sellRate,
            sellAmount: req.body.newOfferData.sellAmount,
        })

        await newOffer.save();
        return res.send('offer Saved');
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;