const express = require("express");
const Joi = require("joi");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const config = require("config");
const debug = require("debug")("app:startup");
// const dbDebugger = require("debug")("app:db");

const log = require("./logger");
const authentication = require("./authentication");

const app = express();

app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

console.log(`Application - ${config.get("name")}`);
console.log(`Mail - ${config.get("mail.host")}`);
console.log(`Mail - ${config.get("mail.password")}`);

if (app.get("env") === "development") {
	let accessLogStream = fs.createWriteStream(
		path.join(__dirname, "requests.log"),
		{ flags: "a" }
	);
	app.use(morgan("tiny", { stream: accessLogStream }));
	debug("Morgan enabled.");
}

app.use(log);
app.use(authentication);

const products = [
	{ id: 1, title: "Product1" },
	{ id: 2, title: "Product2" },
	{ id: 3, title: "Product3" },
];

app.get("/", (req, res) =>
	res.render("index", { title: "Express App", message: "Hello" })
);

app.get("/products", (req, res) => res.send(products));

app.get("/products/:id", (req, res) => {
	const matchedProduct = products.find((p) => p.id === parseInt(req.params.id));
	if (!matchedProduct) {
		return res.status(404).send("Product with a given id was not found.");
	}
	res.send(matchedProduct);
});

app.post("/products", (req, res) => {
	const { error } = validateProduct(req.body);

	if (error) {
		return res.status(400).send(result.error.details[0].message);
	}
	const newProduct = { id: ++products.length, title: req.body.title };
	products.push(newProduct);
	return res.status(201).send(newProduct);
});

app.put("/products/:id", (req, res) => {
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

app.delete("/products/:id", (req, res) => {
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

const port = process.env.PORT || 3005;
console.log(port);
app.listen(3005);
