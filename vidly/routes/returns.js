const express = require("express");
const Joi = require("joi");

const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { Rental } = require("../schemaModels/rental");
const { Movie } = require("../schemaModels/movie");

const returnsRouter = express.Router();

returnsRouter.post("/", [auth, validate(validateReturn)], async (req, res) => {
	const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

	if (!rental) {
		return res
			.status(404)
			.send("No rental was found for this customer and movie");
	}

	if (rental.dateReturned) {
		return res.status(400).send("Rental is already precessed");
	}

	rental.return();
	await rental.save();

	await Movie.findByIdAndUpdate(rental.movie._id, {
		$inc: { numberInStock: 1 },
	});

	return res.send(rental);
});

function validateReturn(returnObj) {
	const schema = {
		customerId: Joi.objectId().required(),
		movieId: Joi.objectId().required(),
	};

	return Joi.validate(returnObj, schema);
}

module.exports = returnsRouter;
