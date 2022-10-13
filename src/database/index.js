const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "kepo",
  port: 3306,
  multipleStatements: true,
});

db.connect((err) => {
  if (err) {
    return console.log(`error: ${err.message}`);
  }
  console.log("connected to MySQL server");
});

module.exports = { db };
