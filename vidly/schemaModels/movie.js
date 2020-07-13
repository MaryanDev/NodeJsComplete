const mongoose = require("mongoose");
const Joi = require("joi");

const { genreSchema } = require("./genre");

const movieSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		minlength: 2,
		maxlength: 200,
		trim: true,
	},
	genre: {
		type: genreSchema,
		required: true,
	},
	numberInStock: {
		type: Number,
		required: true,
		min: 0,
		max: 255,
	},
	dailyRentalRate: {
		type: Number,
		required: true,
		min: 0,
		max: 255,
	},
});

module.exports.Movie = mongoose.model("Movie", movieSchema);

module.exports.validateMovie = function (movie) {
	const schema = {
		title: Joi.string().min(2).max(200).required(),
		genreId: Joi.string().required(),
		numberInStock: Joi.number().min(0).max(255).required(),
		dailyRentalRate: Joi.number().min(0).max(255).required(),
	};

	return Joi.validate(movie, schema);
};
