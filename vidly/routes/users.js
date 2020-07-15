const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const { User, validateUser } = require("../schemaModels/user");
const auth = require("../middleware/auth");

const usersRouter = express.Router();

usersRouter.get("/me", auth, async (req, res) => {
	const user = await User.findById(req.user._id).select("-password");
	return res.send(user);
});

usersRouter.post("/", async (req, res) => {
	const { error } = validateUser(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let user = await User.findOne({ email: req.body.email });
	if (user) {
		return res.status(400).send("User with this email is already registered.");
	}

	user = new User(_.pick(req.body, ["name", "email", "password"]));

	user.password = await bcrypt.hash(user.password, await bcrypt.genSalt(10));

	await user.save();

	return res
		.header("x-auth-token", user.genAuthToken())
		.send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = usersRouter;
