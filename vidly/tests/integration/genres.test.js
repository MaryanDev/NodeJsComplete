const request = require("supertest");
const mongoose = require("mongoose");

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
		await server.close();
	});

	let token;
	let name;
	let _id;

	const noAuthTest = async (exec) => {
		token = "";
		const res = await exec();
		expect(res.status).toBe(401);
	};

	const minLengthTest = async (exec) => {
		name = "abcd";
		const res = await exec();
		expect(res.status).toBe(400);
	};

	const maxLengthTest = async (exec) => {
		name = new Array(52).join("a");
		const res = await exec();
		expect(res.status).toBe(400);
	};

	const noNameTest = async (exec) => {
		name = undefined;
		const res = await exec();
		expect(res.status).toBe(400);
	};

	const nameNotAStringTest = async (exec) => {
		name = { test: 2 };
		const res = await exec();
		expect(res.status).toBe(400);
	};

	const resBodyTest = async (exec) => {
		const res = await exec();

		expect(res.body).toHaveProperty("_id");
		expect(res.body).toMatchObject({ name: name });
	};

	const invalidIdTest = async (exec) => {
		_id = 1;
		const res = await exec();
		expect(res.status).toBe(404);
	};

	const validIdButNoMatchTest = async (exec) => {
		_id = mongoose.Types.ObjectId();
		const res = await exec();
		expect(res.status).toBe(404);
	};

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

		it("should return 404 with valid id but no matched document", async () => {
			const res = await request(server).get(
				`${genresRoute}/${mongoose.Types.ObjectId()}`
			);
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

		const exec = async () => {
			return await request(server)
				.post(genresRoute)
				.set("x-auth-token", token)
				.send({ name });
		};

		it("should return 401 if user is not logged in", async () => {
			await noAuthTest(exec);
		});

		it("should return 400 if genre is less than 5 characters long", async () => {
			await minLengthTest(exec);
		});

		it("should return 400 if genre is more than 50 characters long", async () => {
			await maxLengthTest(exec);
		});

		it("should return 400 if genre name is not provided", async () => {
			await noNameTest(exec);
		});

		it("should return 400 if genre name not a string", async () => {
			await nameNotAStringTest(exec);
		});

		it("should create genre if it is valid", async () => {
			await exec();
			const genre = await Genre.find({ name: "genre1" });
			expect(genre).not.toBeNull();
		});

		it("should return genre in the response body", async () => {
			await resBodyTest(exec);
		});
	});

	describe("PUT /:id", () => {
		beforeEach(async () => {
			token = new User().genAuthToken();
			name = "genre1";
			_id = (await Genre.collection.insertOne({ name: "genre2" })).insertedId;
		});

		const exec = async () => {
			return await request(server)
				.put(`${genresRoute}/${_id}`)
				.set("x-auth-token", token)
				.send({ name });
		};

		it("should return 401 if user is not logged in", async () => {
			await noAuthTest(exec);
		});

		it("should return 404 if id is invalid", async () => {
			await invalidIdTest(exec);
		});

		it("should return 404 if id is valid but not objects found", async () => {
			await validIdButNoMatchTest(exec);
		});

		it("should return 400 if genre is less than 5 characters long", async () => {
			await minLengthTest(exec);
		});

		it("should return 400 if genre is more than 50 characters long", async () => {
			await maxLengthTest(exec);
		});

		it("should return 400 if genre name is not provided", async () => {
			await noNameTest(exec);
		});

		it("should return 400 if genre name not a string", async () => {
			await nameNotAStringTest(exec);
		});

		it("should update genre if it is valid", async () => {
			await exec();
			const genre = await Genre.findById(_id);
			expect(genre.name).toBe(name);
		});

		it("should return genre in the response body", async () => {
			await resBodyTest(exec);
		});
	});

	describe("DELETE /:id", () => {
		beforeEach(async () => {
			token = new User({ isAdmin: true }).genAuthToken();
			_id = (await Genre.collection.insertOne({ name: "genre1" })).insertedId;
		});

		const exec = async () => {
			return await request(server)
				.delete(`${genresRoute}/${_id}`)
				.set("x-auth-token", token);
		};

		it("should return 401 if user is not logged in", async () => {
			await noAuthTest(exec);
		});

		it("should return 403 if user is not an admin", async () => {
			token = new User().genAuthToken();

			const res = await exec();

			expect(res.status).toBe(403);
		});

		it("should return 404 if id is invalid", async () => {
			await invalidIdTest(exec);
		});

		it("should return 404 if id is valid but not objects found", async () => {
			await validIdButNoMatchTest(exec);
		});

		it("should delete genre if id is valid", async () => {
			await exec();

			const genre = await Genre.findById(_id);
			expect(genre).toBeNull();
		});

		it("should return genre in the response body", async () => {
			await resBodyTest(exec);
		});
	});
});
