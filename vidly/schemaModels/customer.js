const mongoose = require("mongoose");
const Joi = require("joi");

const { phoneRegex } = require("../constants/regex-constants");

module.exports.Customer = mongoose.model(
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

module.exports.validateCustomer = function (customer) {
	const schema = {
		name: Joi.string().min(3).max(100).required(),
		phone: Joi.string().regex(phoneRegex).required(),
		isGold: Joi.boolean(),
	};

	return Joi.validate(customer, schema);
};
