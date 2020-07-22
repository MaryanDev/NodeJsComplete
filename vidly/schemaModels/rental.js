const mongoose = require("mongoose");
const Joi = require("joi");
const moment = require("moment");

const { phoneRegex } = require("../constants/regex-constants");

const rentalSchema = new mongoose.Schema({
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
});

rentalSchema.statics.lookup = function (customerId, movieId) {
	return this.findOne({
		"customer._id": customerId,
		"movie._id": movieId,
	});
};

rentalSchema.methods.return = function () {
	this.dateReturned = new Date();

	this.rentalFee =
		moment().diff(this.dateOut, "days") * this.movie.dailyRentalRate;
};

module.exports.Rental = mongoose.model("Rental", rentalSchema);

module.exports.validateRental = function (rental) {
	const schema = {
		customerId: Joi.objectId().required(),
		movieId: Joi.objectId().required(),
	};

	return Joi.validate(rental, schema);
};
