const express = require("express");
const { Genre, validateGenre } = require("../schemaModels/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

router.get("/", async (req, res) => {
	const genres = await Genre.find();
	res.send(genres);
});

router.get("/:id", async (req, res) => {
	const genre = await Genre.findById(req.params.id);
	if (!genre) {
		return res.status(404).send("The genre with the given ID was not found.");
	}

	res.send(genre);
});

router.post("/", auth, async (req, res) => {
	const { error } = validateGenre(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const genre = new Genre({
		name: req.body.name,
	});

	await genre.save();
	res.send(genre);
});

router.put("/:id", auth, async (req, res) => {
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

router.delete("/:id", [auth, admin], async (req, res) => {
	let genre = await Genre.findByIdAndRemove(req.params.id);
	if (!genre) {
		return res.status(404).send("The genre with the given ID was not found.");
	}

	res.send(genre);
});

module.exports = router;
