const express = require("express");
const Joi = require("joi");

const Customer = require("../schemaModels/customer");
const phoneRegex = require("../constants/regex-constants").phoneRegex;

const customersRouter = express.Router();

customersRouter.get("/", async (req, res) => {
	const customers = await Customer.find();
	res.send(customers);
});

customersRouter.get("/:id", async (req, res) => {
	const customer = await Customer.findById(req.params.id);
	if (!customer) {
		return res.status(404).send("Customer with a given id was not found.");
	}

	res.send(customer);
});

customersRouter.post("/", async (req, res) => {
	const { error } = validateCustomer(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let customer = new Customer({
		isGold: req.body.isGold,
		name: req.body.name,
		phone: req.body.phone,
	});

	customer = await customer.save();
	res.send(customer);
});

customersRouter.put("/:id", async (req, res) => {
	const { error } = validateCustomer(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const customer = await Customer.findByIdAndUpdate(
		{ _id: req.params.id },
		{
			$set: {
				isGold: req.body.isGold,
				name: req.body.name,
				phone: req.body.phone,
			},
		},
		{ new: true }
	);

	if (!customer) {
		return res
			.status(404)
			.send("The customer with the given ID was not found.");
	}

	res.send(customer);
});

customersRouter.delete("/:id", async (req, res) => {
	const customer = await Customer.findByIdAndRemove(req.params.id);
	if (!customer) {
		return res
			.status(404)
			.send("The customer with the given ID was not found.");
	}

	res.send(customer);
});

function validateCustomer(customer) {
	const schema = {
		name: Joi.string().min(3).max(100).required(),
		phone: Joi.string().regex(phoneRegex).required(),
		isGold: Joi.boolean(),
	};

	return Joi.validate(customer, schema);
}

module.exports = customersRouter;
