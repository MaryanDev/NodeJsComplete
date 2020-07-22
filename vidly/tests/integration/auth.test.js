const request = require("supertest");

const { User } = require("../../schemaModels/user");
const { Genre } = require("../../schemaModels/genre");

describe("auth middleware", () => {
	beforeEach(() => {
		server = require("../../index");
		token = new User().genAuthToken();
	});

	afterEach(async () => {
		await server.close();
		await Genre.remove({});
	});

	let token;

	const exec = async () => {
		return await request(server)
			.post("/api/genres")
			.set("x-auth-token", token)
			.send({ name: "genre1" });
	};

	it("should return 401 if no token provided", async () => {
		token = "";

		const res = await exec();

		expect(res.status).toBe(401);
	});

	it("should return 400 if token is invalid", async () => {
		token = "a";

		const res = await exec();

		expect(res.status).toBe(400);
	});

	it("should return 404 if token is valid", async () => {
		const res = await exec();

		expect(res.status).toBe(200);
	});
});
