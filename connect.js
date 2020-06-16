const mysql = require("mysql");
require("dotenv");
const { DB_USER, DB_PASSWORD } = process.env;
const connection = mysql.createConnection({
  host: "localhost",
  user: DB_USER,
  password: DB_PASSWORD,
  database: "fil-rouge-express",
});

module.exports = connection;
