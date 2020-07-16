const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
	winston.add(new winston.transports.Console());
	winston.add(new winston.transports.File({ filename: "logfile.log" }));
	winston.add(
		new winston.transports.MongoDB({
			db: "mongodb://localhost/vidly",
			level: "error",
		})
	);

	process.on("uncaughtException", (err) => {
		winston.error(err.message, { metadata: err });
		process.exit(1);
	});

	process.on("unhandledRejection", (err) => {
		winston.error(err.message, { metadata: err });
		process.exit(1);
	});
};
