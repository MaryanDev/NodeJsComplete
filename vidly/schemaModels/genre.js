const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 250,
		trim: true,
	},
});

module.exports = mongoose.model("Genre", genreSchema);
