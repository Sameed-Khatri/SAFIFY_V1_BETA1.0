const mysql = require('mysql2');
var fs = require('fs');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync(__dirname +'/ca.pem').toString(),
    }
});

module.exports = pool.promise();