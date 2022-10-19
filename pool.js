const mysql = require("promise-mysql");
const dotenv = require("dotenv");
dotenv.config();
const pool_async = async () => {
  return mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.INSTANCE_HOST,
  });
};
module.exports = { pool_async };
