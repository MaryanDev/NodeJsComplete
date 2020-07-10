const express = require("express");

const homeRouter = express.Router();

homeRouter.get("/", (req, res) =>
	res.render("index", { title: "Express App", message: "Hello" })
);

module.exports = homeRouter;
