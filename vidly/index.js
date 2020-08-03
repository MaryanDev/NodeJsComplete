const express = require("express");
const winston = require("winston");

const app = express();
require("./startup/logging")();
require("./startup/cors")(app);
require("./startup/db")();
require("./startup/validation")();
require("./startup/routes")(app);
require("./startup/config")();
require("./startup/prod")(app);
// app.use(function (req, res, next) {
// 	res.header("Access-Control-Allow-Origin", "http://localhost:3006"); // update to match the domain you will make the request from
// 	res.header(
// 		"Access-Control-Allow-Headers",
// 		"Origin, X-Requested-With, Content-Type, Accept"
// 	);
// 	next();
// });

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
	winston.info(`Listening on port ${port}...`)
);
module.exports = server;
