const express = require("express");

const { Customer, validateCustomer } = require("../schemaModels/customer");
const auth = require("../middleware/auth");

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

customersRouter.post("/", auth, async (req, res) => {
	const { error } = validateCustomer(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const customer = new Customer({
		isGold: req.body.isGold,
		name: req.body.name,
		phone: req.body.phone,
	});

	await customer.save();
	res.send(customer);
});

customersRouter.put("/:id", auth, async (req, res) => {
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

customersRouter.delete("/:id", auth, async (req, res) => {
	const customer = await Customer.findByIdAndRemove(req.params.id);
	if (!customer) {
		return res
			.status(404)
			.send("The customer with the given ID was not found.");
	}

	res.send(customer);
});

module.exports = customersRouter;
