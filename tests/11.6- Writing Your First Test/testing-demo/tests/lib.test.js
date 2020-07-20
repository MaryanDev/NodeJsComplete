const lib = require("../lib");
const db = require("../db");
const mail = require("../mail");

describe("absolute", () => {
	it("should return a positive number if input is positive", () => {
		const result = lib.absolute(1);
		expect(result).toBe(1);
	});

	it("should return a positive number if input is negative", () => {
		const result = lib.absolute(-1);
		expect(result).toBe(1);
	});

	it("should return zero if input is zero", () => {
		const result = lib.absolute(0);
		expect(result).toBe(0);
	});
});

describe("greet", () => {
	it("should return greeting message", () => {
		const result = lib.greet("Marian");
		expect(result).toMatch(/Marian/);
		expect(result).toContain("Marian");
	});
});

describe("getCurrencies", () => {
	it("should return list of supported currencies", () => {
		const result = lib.getCurrencies();
		expect(result).toEqual(expect.arrayContaining(["EUR", "AUD", "USD"]));
	});
});

describe("getProduct", () => {
	it("should return product with a given id", () => {
		const result = lib.getProduct(1);

		expect(result).toEqual({ id: 1, price: 10 });
		expect(result).toMatchObject({ id: 1 });
		expect(result).toHaveProperty("id", 1);
	});
});

describe("registerUser", () => {
	it("should throw an error if user is falsy", () => {
		[null, undefined, NaN, "", 0, false].forEach((a) => {
			expect(() => lib.registerUser(a)).toThrow();
		});
	});

	it("should return a user object if valid user provided", () => {
		const result = lib.registerUser("Marian");
		expect(result).toMatchObject({ username: "Marian" });
		expect(result.id).toBeGreaterThan(0);
	});
});

describe("applyDiscount", () => {
	it("should apply discount if customers points greater than 10", () => {
		db.getCustomerSync = function (customerId) {
			console.log("Fake reading customer...");
			return { id: customerId, points: 20 };
		};

		const order = { customerId: 1, totalPrice: 10 };
		lib.applyDiscount(order);
		expect(order.totalPrice).toBe(9);
	});
});

describe("notifyCustomer", () => {
	it("should send email to the customer", () => {
		db.getCustomerSync = jest.fn().mockReturnValue({ email: "a" });
		mail.send = jest.fn();

		lib.notifyCustomer({ customerId: 1 });
		expect(mail.send).toHaveBeenCalled();
		expect(mail.send.mock.calls[0][0]).toBe("a");
		expect(mail.send.mock.calls[0][1]).toMatch(/order/);
	});
});
