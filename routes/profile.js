const express = require("express");
const router = express.Router();
const Users = require("../models/Users");

router.post("/profile", async (req, res) => {
	try {
		console.log(req.body.newProfileData.name);
		// const user = await Users.findById(req.body.newProfileData.userID);
		const updatedUserData = {
			name: req.body.newProfileData.name,
			email: req.body.newProfileData.email,
			balance: {
				INR: req.body.newProfileData.INR,
				EUR: req.body.newProfileData.EUR,
				USD: req.body.newProfileData.USD,
			},
		};
		Users.findByIdAndUpdate(req.body.newProfileData.userID, updatedUserData)
			.then((updatedUser) => {
				if (updatedUser) {
                    return res.send('user updated');
					console.log("Updated user:", updatedUser);
				} else {
                    return res.send('user not found');
					console.log("User not found");
				}
			})
			.catch((error) => {
                return res.send('Error updating user', error);
				console.error("Error updating user:", error);
			});
	} catch (error) {
		console.log(error);
		return res.send(error);
	}
});

module.exports = router;
