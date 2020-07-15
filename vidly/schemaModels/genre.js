const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 250,
		trim: true,
	},
});

module.exports.genreSchema = genreSchema;

module.exports.Genre = mongoose.model("Genre", genreSchema);

module.exports.validateGenre = function (genre) {
	const schema = {
		name: Joi.string().min(3).required(),
	};

	return Joi.validate(genre, schema);
};
