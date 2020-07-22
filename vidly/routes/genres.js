const express = require("express");

const { Genre, validateGenre } = require("../schemaModels/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const validate = require("../middleware/validate");

const router = express.Router();

router.get("/", async (req, res) => {
	const genres = await Genre.find();
	res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
	const genre = await Genre.findById(req.params.id);

	if (!genre) {
		return res.status(404).send("The genre with the given ID was not found.");
	}

	res.send(genre);
});

router.post("/", [auth, validate(validateGenre)], async (req, res) => {
	const genre = new Genre({
		name: req.body.name,
	});

	await genre.save();
	res.send(genre);
});

router.put(
	"/:id",
	[auth, validateObjectId, validate(validateGenre)],
	async (req, res) => {
		let genre = await Genre.findById(req.params.id);

		if (!genre)
			return res.status(404).send("The genre with the given ID was not found.");

		genre.set({
			name: req.body.name,
		});

		genre = await genre.save();
		res.send(genre);
	}
);

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
	let genre = await Genre.findByIdAndRemove(req.params.id);
	if (!genre) {
		return res.status(404).send("The genre with the given ID was not found.");
	}

	res.send(genre);
});

module.exports = router;
