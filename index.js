// ! requiring packages
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const User = require('./models/Users');
const authRoutes = require('./routes/auth');
const offerRoutes = require('./routes/offer');
const profileRoutes = require('./routes/profile');

// ! initializing packages
const app = express();
require('dotenv').config();

// ! Cors
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cors({ origin: "https://smalblu.onrender.com", credentials: true }));

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


// ! Importing Routes
app.use(authRoutes);
app.use(offerRoutes);
app.use(profileRoutes);
app.get('/', function(req, res) {
	res.send('server is working');
});

// ! server configuration
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));


// ! listening to port
const port = process.env.PORT;
app.listen(port, () => {
	console.log(`server started on port ${port}`);
});