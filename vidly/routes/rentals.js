const express = require("express");
const { Rental, validateRental } = require("../schemaModels/rental");
const { Customer } = require("../schemaModels/customer");
const { Movie } = require("../schemaModels/movie");

const rentalRouter = express.Router();

rentalRouter.get("/", async (req, res) => {
	const rentals = await Rental.find().sort("-dateOut");
	return res.send(rentals);
});

rentalRouter.post("/", async (req, res) => {
	const { error } = validateRental(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const customer = await Customer.findById(req.body.customerId);
	if (!customer) {
		return res.status(404).send("Customer with a given id was not found.");
	}

	const movie = await Movie.findById(req.body.movieId);
	if (!movie) {
		return res.status(404).send("Movie with a given id was not found.");
	}

	if (movie.numberInStock === 0) {
		return res.status(404).send("Movie is not in the stock.");
	}

	let rental = new Rental({
		customer: {
			_id: customer._id,
			name: customer.name,
			phone: customer.phone,
		},
		movie: {
			_id: movie._id,
			title: movie.title,
			dailyRentalRate: movie.dailyRentalRate,
		},
	});

	rental = await rental.save();

	movie.numberInStock--;
	await movie.save();

	return res.send(rental);
});

module.exports = rentalRouter;
