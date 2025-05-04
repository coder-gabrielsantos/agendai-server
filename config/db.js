const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

db.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to the database: ", err);

    } else {
        console.log("Connection to the database established...");
        connection.release();
    }
});

module.exports = db;
