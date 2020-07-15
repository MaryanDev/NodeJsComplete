const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

const app = express();

if (!config.get("jwtPrivateKey")) {
	console.log("FATAL ERROR: jwtPrivateKey is not defined.");
	process.exit(1);
}

mongoose
	.connect("mongodb://localhost/vidly", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => console.log("Connected"))
	.catch((err) => console.log("could not connect. " + err));

app.use(express.json());

app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
