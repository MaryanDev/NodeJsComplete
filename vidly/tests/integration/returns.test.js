const request = require("supertest");
const mongoose = require("mongoose");
const moment = require("moment");

const { Rental } = require("../../schemaModels/rental");
const { User } = require("../../schemaModels/user");
const { Movie } = require("../../schemaModels/movie");

describe("/api/returns", () => {
	let server;
	let payload = {};
	let rental;
	let token;
	let movie;

	beforeEach(async () => {
		server = require("../../index");

		movie = new Movie({
			title: "New Movie",
			genre: { _id: mongoose.Types.ObjectId(), name: "New genre" },
			numberInStock: 10,
			dailyRentalRate: 2,
		});

		await movie.save();

		payload.customerId = mongoose.Types.ObjectId();
		payload.movieId = movie._id;

		rental = new Rental({
			customer: {
				_id: payload.customerId,
				name: "12345",
				phone: "+(123)-456-78-90",
			},
			movie: {
				_id: payload.movieId,
				title: "12345",
				dailyRentalRate: 2,
			},
		});
		await rental.save();
		token = new User().genAuthToken();
	});

	afterEach(async () => {
		await server.close();
		await Rental.remove({});
		await Movie.remove({});
	});

	const exec = async () => {
		return await request(server)
			.post("/api/returns")
			.set("x-auth-token", token)
			.send(payload);
	};

	it("should return 401 if client is not logged in", async () => {
		token = "";

		const res = await exec();

		expect(res.status).toBe(401);
	});

	it("should return 400 if customerId is not provided", async () => {
		delete payload.customerId;

		const res = await exec();

		expect(res.status).toBe(400);
	});

	it("should return 400 if movieId is not provided", async () => {
		delete payload.movieId;

		const res = await exec();

		expect(res.status).toBe(400);
	});

	it("should return 404 if no rental found for this customer/movie", async () => {
		await Rental.remove({});

		const res = await exec();

		expect(res.status).toBe(404);
	});

	it("should return 400 if rental is already precessed", async () => {
		rental.dateReturned = new Date();
		await rental.save();

		const res = await exec();

		expect(res.status).toBe(400);
	});

	it("should return 200 if request is valid", async () => {
		const res = await exec();

		expect(res.status).toBe(200);
	});

	it("should set the return date if request is valid", async () => {
		await exec();

		const rentalInDb = await Rental.findById(rental._id);
		expect(rentalInDb.dateReturned).toBeDefined();
		const diff = new Date() - rentalInDb.dateReturned;
		expect(diff).toBeLessThan(10000);
	});

	it("should calculate the rental fee", async () => {
		rental.dateOut = moment().add(-7, "days").toDate();
		await rental.save();

		await exec();
		const rentalInDb = await Rental.findById(rental._id);
		expect(rentalInDb.rentalFee).toBeDefined();
		expect(rentalInDb.rentalFee).toBe(14);
	});

	it("should increase the stock for a movie", async () => {
		await exec();

		const movieInDb = await Movie.findById(rental.movie._id);
		expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
	});

	it("should return the rental in the body of a request", async () => {
		const res = await exec();

		expect(Object.keys(res.body)).toEqual(
			expect.arrayContaining([
				"_id",
				"dateOut",
				"dateReturned",
				"rentalFee",
				"customer",
				"movie",
			])
		);
	});
});
