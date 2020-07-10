const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const config = require("config");
const debug = require("debug")("app:startup");

const log = require("./middleware/logger");
const authentication = require("./middleware/authentication");
const productsRouter = require("./routes/products");
const homeRouter = require("./routes/home");

const app = express();

app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

console.log(`Application - ${config.get("name")}`);
console.log(`Mail - ${config.get("mail.host")}`);
console.log(`Mail - ${config.get("mail.password")}`);

if (app.get("env") === "development") {
	let accessLogStream = fs.createWriteStream(
		path.join(__dirname, "requests.log"),
		{ flags: "a" }
	);
	app.use(morgan("tiny", { stream: accessLogStream }));
	debug("Morgan enabled.");
}

app.use(log);
app.use(authentication);

app.use("/products", productsRouter);
app.use("/", homeRouter);

const port = process.env.PORT || 3005;
console.log(port);
app.listen(3005);
