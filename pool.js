const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();
const pool = mysql.createPool({
  connectTimeout: 60 * 60 * 1000,
  acquireTimeout: 60 * 60 * 1000,
  timeout: 60 * 60 * 1000,
  waitForConnections: true,
  user: "root",
  password: process.env.PASSWORD,
  database: "movies",
  host: process.env.HOST,
});
module.exports = { pool };
