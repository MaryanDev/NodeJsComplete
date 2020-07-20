const ex = require("../exercise1");

describe("fizzBuzz", () => {
	it("should throw if typeof input is not a number", () => {
		["a", "", {}, [], null, undefined].forEach((a) => {
			expect(() => ex.fizzBuzz(a)).toThrow();
		});
	});

	it("should return 'FizzBuzz' if input % 3 === 0 and input % 5 === 0", () => {
		const result = ex.fizzBuzz(15);
		expect(result).toEqual("FizzBuzz");
	});

	it("should return 'Fizz' if input % 3 === 0", () => {
		const result = ex.fizzBuzz(9);
		expect(result).toEqual("Fizz");
	});

	it("should return 'Buzz' if input % 5 === 0", () => {
		const result = ex.fizzBuzz(10);
		expect(result).toEqual("Buzz");
	});

	it("should return input if input is number and not input % 5 === 0 and input % 3 === 0", () => {
		const result = ex.fizzBuzz(17);
		expect(result).toBe(17);
	});
});
