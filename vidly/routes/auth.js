const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const { User } = require("../schemaModels/user");

const authRouter = express.Router();

authRouter.post("/", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const user = await User.findOne({ email: req.body.email });
	if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
		return res.status(400).send("Invalid email or password.");
	}

	return res.send(user.genAuthToken());
});

function validate(req) {
	const schema = {
		email: Joi.string().email().required(),
		password: Joi.string().min(5).max(255).required(),
	};

	return Joi.validate(req, schema);
}

module.exports = authRouter;
