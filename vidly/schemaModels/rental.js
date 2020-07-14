const mongoose = require("mongoose");
const Joi = require("joi");
// Joi.objectId = require("joi-objectid")(Joi);
const { phoneRegex } = require("../constants/regex-constants");

module.exports.Rental = mongoose.model(
	"Rental",
	new mongoose.Schema({
		customer: {
			type: new mongoose.Schema({
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
			}),
			required: true,
		},
		movie: {
			type: new mongoose.Schema({
				title: {
					type: String,
					required: true,
					minlength: 2,
					maxlength: 200,
					trim: true,
				},
				dailyRentalRate: {
					type: Number,
					required: true,
					min: 0,
					max: 255,
				},
			}),
			required: true,
		},
		dateOut: {
			type: Date,
			required: true,
			default: Date.now(),
		},
		dateReturned: {
			type: Date,
		},
		rentalFee: {
			type: Number,
			min: 0,
		},
	})
);

module.exports.validateRental = function (rental) {
	const schema = {
		customerId: Joi.objectId().required(),
		movieId: Joi.objectId().required(),
	};

	return Joi.validate(rental, schema);
};
