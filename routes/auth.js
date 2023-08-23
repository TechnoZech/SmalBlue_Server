const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
const bcrypt = require("bcryptjs");

router.post("/getuser", async (req, res) => {
    const token = req.body.token;
	try {
		const user = jwt.verify(token, process.env.JWT_SECRET, (err, res) => {
			if (err) {
				return "token expired";
			}
			return res;
		});
		if (user == "token expired") {
			return res.send({ status: "error", data: "token expired" });
		}
		const useremail = user.email;
		Users.findOne({ email: useremail })
			.then((data) => {
				res.send({ status: "ok", data: data });
			})
			.catch((error) => {
				res.send({ status: "error", data: error });
			});
	} catch (error) {
        res.send(error);
    }
});

router.post("/login", async (req, res) => {
	const user = await Users.findOne({ email: req.body.userData.email });
	if (!user) {
		return res.send({ error: "User Not found" });
	}
	if (await bcrypt.compare(req.body.userData.password, user.password)) {
		const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
			expiresIn: "15m",
		});

		if (res.status(201)) {
			return res.json({ status: "ok", data: token });
		} else {
			return res.send({ error: "error" });
		}
	}
	return res.json({ status: "error", error: "Invalid Password" });
});

router.post("/signup", async (req, res) => {
	try {
		const oldUser = await Users.findOne({ email: req.body.userData.email });
		if (oldUser) {
			console.log("user already exists");
			return res.send("User Already exists");
		}

		const encryptedPassword = await bcrypt.hash(req.body.userData.password, 10);
		const newUserData = new Users({
			name: req.body.userData.name,
			email: req.body.userData.email,
			password: send,
		});
		await newUserData.save();

		console.log(newUserData);
		console.log("user signedup");
		return res.send("user saved");
	} catch (error) {
		return res.send(error);
	}
});

module.exports = router;
