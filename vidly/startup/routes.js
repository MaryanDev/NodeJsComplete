const express = require("express");

const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const usersRouter = require("../routes/users");
const authRouter = require("../routes/auth");
const returnsRouter = require("../routes/returns");
const error = require("../middleware/error");

module.exports = function (app) {
	app.use(express.json());

	app.use("/api/genres", genres);
	app.use("/api/customers", customers);
	app.use("/api/movies", movies);
	app.use("/api/rentals", rentals);
	app.use("/api/users", usersRouter);
	app.use("/api/auth", authRouter);
	app.use("/api/returns", returnsRouter);

	app.use(error);
};
