const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();
const pool = mysql.createPool({
  connectionLimit: 10,
  user: "root",
  password: process.env.PASSWORD,
  database: "movies",
  host: process.env.HOST,
});
module.exports = { pool };
