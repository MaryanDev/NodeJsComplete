const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const { emailRegex } = require("../constants/regex-constants");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		maxLength: 255,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		match: emailRegex,
	},
	password: {
		type: String,
		required: true,
		minlength: 5,
		maxLength: 1024,
	},
	isAdmin: Boolean,
});

userSchema.methods.genAuthToken = function () {
	return jwt.sign(
		{ _id: this._id, isAdmin: this.isAdmin },
		config.get("jwtPrivateKey")
	);
};

module.exports.User = mongoose.model("User", userSchema);

module.exports.validateUser = function (user) {
	const schema = {
		name: Joi.string().min(3).max(255).required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(5).max(255).required(),
	};

	return Joi.validate(user, schema);
};
