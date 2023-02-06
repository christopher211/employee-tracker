import mysql from "mysql2/promise";

// connection to the database
const dbConnection = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "employee_tracker_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export { dbConnection };
