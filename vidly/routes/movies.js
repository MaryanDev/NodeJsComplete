const express = require("express");

const { Movie, validateMovie } = require("../schemaModels/movie");
const { Genre } = require("../schemaModels/genre");

const movieRouter = express.Router();

movieRouter.get("/", async (req, res) => {
	const movies = await Movie.find();
	res.send(movies);
});

movieRouter.get("/:id", async (req, res) => {
	const movie = await Movie.findById(req.params.id);
	if (!movie) {
		return res.status(404).send("Movie with a given id was not found.");
	}

	return res.send(movie);
});

movieRouter.post("/", async (req, res) => {
	const { error } = validateMovie(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	const genre = await Genre.findById(req.body.genreId);
	if (!genre) {
		return res.status(404).send("Invalid genre");
	}

	const movie = new Movie({
		title: req.body.title,
		genre: { _id: genre._id, name: genre.name },
		numberInStock: req.body.numberInStock,
		dailyRentalRate: req.body.dailyRentalRate,
	});

	await movie.save();

	return res.send(movie);
});

movieRouter.put("/:id", async (req, res) => {
	const { error } = validateMovie(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	const genre = await Genre.findById(req.body.genreId);
	if (!genre) {
		return res.status(404).send("Invalid genre");
	}

	const movie = await Movie.findByIdAndUpdate(
		{ _id: req.params.id },
		{
			$set: {
				title: req.body.title,
				genre: { _id: genre._id, name: genre.name },
				numberInStock: req.body.numberInStock,
				dailyRentalRate: req.body.dailyRentalRate,
			},
		},
		{ new: true }
	);

	if (!movie) {
		return res.status(404).send("Movie with a given id was not found.");
	}

	return res.send(movie);
});

movieRouter.delete("/:id", async (req, res) => {
	const movie = await Movie.findByIdAndRemove(req.params.id);
	if (!movie) {
		return res.status(404).send("Movie with a given id was not found.");
	}

	return res.send(movie);
});

module.exports = movieRouter;
