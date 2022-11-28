async function main() {
    // get the client
    const mysql = require('mysql2/promise');
    // create the connection
    const connection = await mysql.createConnection({host:'localhost', user: 'root', password: 'mysql', database: 'employee_track_cms'});
    // query database
    const rows = await connection.execute('SELECT * FROM employees');
    console.log(rows);
  }


  main();