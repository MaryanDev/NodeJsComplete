const express = require("express");
const winston = require("winston");

const app = express();
require("./startup/logging")();
require("./startup/db")();
require("./startup/validation")();
require("./startup/routes")(app);
require("./startup/config")();

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
