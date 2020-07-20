const request = require("supertest");
const { Genre } = require("../../schemaModels/genre");
const { User } = require("../../schemaModels/user");

let server;
const genresRoute = "/api/genres";

describe("/api/genres", () => {
	beforeEach(() => {
		server = require("../../index");
	});
	afterEach(async () => {
		await Genre.remove({});
		server.close();
	});

	describe("GET /", () => {
		it("should return all genres", async () => {
			await Genre.collection.insertMany([
				{ name: "genre1" },
				{ name: "genre2" },
			]);

			const res = await request(server).get(genresRoute);
			expect(res.status).toBe(200);
			expect(res.body.length).toBe(2);
			expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
			expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
		});
	});

	describe("GET /:id", () => {
		it("should return 404 with invalid id", async () => {
			const res = await request(server).get(`${genresRoute}/3`);
			expect(res.status).toBe(404);
		});

		it("should return valid genre", async () => {
			const result = await Genre.collection.insertMany([
				{ name: "genre1" },
				{ name: "genre2" },
			]);

			const res = await request(server).get(
				`/api/genres/${result.insertedIds["0"]}`
			);

			expect(res.status).toBe(200);
			expect(res.body).toMatchObject({ name: "genre1" });
		});
	});

	describe("POST /", () => {
		beforeEach(() => {
			token = new User().genAuthToken();
			name = "genre1";
		});

		let token;
		let name;

		const exec = async () => {
			return await request(server)
				.post(genresRoute)
				.set("x-auth-token", token)
				.send({ name });
		};

		it("should return 401 if user is not logged in", async () => {
			token = "";
			const res = await exec();
			expect(res.status).toBe(401);
		});

		it("should return 400 if genre is less than 5 characters long", async () => {
			name = "abcd";
			const res = await exec();
			expect(res.status).toBe(400);
		});

		it("should return 400 if genre is more than 50 characters long", async () => {
			name = new Array(52).join("a");
			const res = await exec();
			expect(res.status).toBe(400);
		});

		it("should return 400 if genre name is not provided", async () => {
			name = undefined;
			const res = await exec();
			expect(res.status).toBe(400);
		});

		it("should return 400 if genre name not a string", async () => {
			name = { test: 2 };
			const res = await exec();
			expect(res.status).toBe(400);
		});

		it("should create genre if it is valid", async () => {
			await exec();
			const genre = await Genre.find({ name: "genre1" });
			expect(genre).not.toBeNull();
		});

		it("should return genre in the response body", async () => {
			const res = await exec();

			expect(res.body).toHaveProperty("_id");
			expect(res.body).toMatchObject({ name: "genre1" });
		});
	});
});

async function expectBadPost(body) {
	const res = await sendAuthPost(body);

	expect(res.status).toBe(400);
}

async function sendAuthPost(body) {
	const token = new User().genAuthToken();

	return await request(server)
		.post(genresRoute)
		.set("x-auth-token", token)
		.send(body);
}
