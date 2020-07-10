const mongoose = require("mongoose");

const phoneRegex = require("../constants/regex-constants").phoneRegex;

module.exports = mongoose.model(
	"Customer",
	new mongoose.Schema({
		isGold: {
			type: Boolean,
			default: false,
		},
		name: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 100,
			trim: true,
		},
		phone: {
			type: String,
			required: true,
			match: phoneRegex,
		},
	})
);
