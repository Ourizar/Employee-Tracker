// Import and require mysql2
const mysql = require('mysql2');

// Connect to database
const connection = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: 'Mysqlpw123',
    database: 'employees'
  });

  connection.connect(function (err){
      if (err) throw err;
  });

  module.exports = connection;