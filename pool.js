const mysql = require("mysql");
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.HOST,
  user: "root",
  password: process.env.PASSWORD,
  database: "movies",
  socketPath: process.env.DB_NAME,
});
module.exports = { pool };
