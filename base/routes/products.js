const express = require("express");
const Joi = require("joi");
const productsRouter = express.Router();

const products = [
	{ id: 1, title: "Product1" },
	{ id: 2, title: "Product2" },
	{ id: 3, title: "Product3" },
];

productsRouter.get("/", (req, res) => res.send(products));

productsRouter.get("/:id", (req, res) => {
	const matchedProduct = products.find((p) => p.id === parseInt(req.params.id));
	if (!matchedProduct) {
		return res.status(404).send("Product with a given id was not found.");
	}
	res.send(matchedProduct);
});

productsRouter.post("/", (req, res) => {
	const { error } = validateProduct(req.body);

	if (error) {
		return res.status(400).send(result.error.details[0].message);
	}
	const newProduct = { id: ++products.length, title: req.body.title };
	products.push(newProduct);
	return res.status(201).send(newProduct);
});

productsRouter.put("/:id", (req, res) => {
	const matchedProduct = products.find((p) => p.id === parseInt(req.params.id));
	if (!matchedProduct) {
		return res.status(404).send("Product with a given id was not found.");
	}
	const { error } = validateProduct(req.body);

	if (error) {
		return res.status(400).send(result.error.details[0].message);
	}
	matchedProduct.title = req.body.title;
	res.status(200).send(matchedProduct);
});

productsRouter.delete("/:id", (req, res) => {
	const matchedProduct = products.find((p) => p.id === parseInt(req.params.id));
	if (!matchedProduct) {
		return res.status(404).send("Product with a given id was not found.");
	}

	products.splice(products.indexOf(matchedProduct), 1);
	res.send(matchedProduct);
});

function validateProduct(product) {
	const schema = Joi.object({
		title: Joi.string().min(3).required(),
	});

	return schema.validate(req.body);
}

module.exports = productsRouter;
