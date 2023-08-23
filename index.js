// ! requiring packages
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const bodyParser = require('body-parser')
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/Users');
const path = require('path');
const authRoutes = require('./routes/auth');

// ! initializing packages
const app = express();
require('dotenv').config();

// ! Cors
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())

// ! database connection
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log('db Connected');
	})
	.catch((error) => {
		console.log(error);
	});

// ! session setup
// app.use(
// 	session({
// 		secret: process.env.SESSION_SECRET,
// 		resave: false,
// 		saveUninitialized: true,
// 		cookie: {
// 			httpOnly: true,
// 			maxAge: 1000 * 60 * 60 * 24 * 2
// 			// secure: true
// 		}
// 	})
// );

// ! Importing Routes
app.use(authRoutes);
app.get('/', function(req, res) {
	res.send('server is working');
});




// ! Passport setup 
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new localStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


// ! server configuration
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));


// ! listening to port
const port = process.env.PORT;
app.listen(port, () => {
	console.log(`server started on port ${port}`);
});