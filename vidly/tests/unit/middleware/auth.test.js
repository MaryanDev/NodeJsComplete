const mongoose = require("mongoose");

const { User } = require("../../../schemaModels/user");
const auth = require("../../../middleware/auth");

describe("auth middleware", () => {
	it("should populate req.user with the payload o a valid JWT", () => {
		const user = {
			_id: mongoose.Types.ObjectId().toHexString(),
			isAdmin: true,
		};
		const token = new User(user).genAuthToken();

		const req = {
			header: jest.fn().mockReturnValue(token),
		};
		const res = {};
		const next = jest.fn();

		auth(req, res, next);

		expect(req.user).toMatchObject(user);
	});
});
