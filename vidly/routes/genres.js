const Joi = require("joi");
const express = require("express");
const Genre = require("../schemaModels/genre");

const router = express.Router();

router.get("/", async (req, res) => {
	const genres = await Genre.find();
	res.send(genres);
});

router.post("/", async (req, res) => {
	const { error } = validateGenre(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let genre = new Genre({
		name: req.body.name,
	});

	genre = await genre.save();
	res.send(genre);
});

router.put("/:id", async (req, res) => {
	let genre = await Genre.findById(req.params.id);

	if (!genre)
		return res.status(404).send("The genre with the given ID was not found.");

	const { error } = validateGenre(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	genre.set({
		name: req.body.name,
	});

	genre = await genre.save();
	res.send(genre);
});

router.delete("/:id", async (req, res) => {
	let genre = await Genre.findByIdAndRemove(req.params.id);
	if (!genre) {
		return res.status(404).send("The genre with the given ID was not found.");
	}

	res.send(genre);
});

router.get("/:id", async (req, res) => {
	const genre = await Genre.findById(req.params.id);
	if (!genre) {
		return res.status(404).send("The genre with the given ID was not found.");
	}

	res.send(genre);
});

function validateGenre(genre) {
	const schema = {
		name: Joi.string().min(3).required(),
	};

	return Joi.validate(genre, schema);
}

module.exports = router;
