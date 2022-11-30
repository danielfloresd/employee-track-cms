// Require mysql-import
const Importer = require('mysql-import');
const mysql = require('mysql');

const {exit} = require('process');

const CLEARDB_DATABASE_URL =
    'mysql://b0ca17fbc3e177:7b746377@us-cdbr-east-06.cleardb.net/heroku_2e86a661a20b463?reconnect=true';
const DATABASE_URL = process.env.DATABASE_URL ||
                     "mysql://root:mysql@localhost/employee_track_cms";
// const host = 'us-cdbr-east-06.cleardb.net';
// const user = 'b0ca17fbc3e177';
// const password = '7b746377';
// const database = 'heroku_2e86a661a20b463';

const host = 'localhost';
const user = 'root';
const password = 'mysql';
const database = 'employee_track_cms';

// Create a new instance of mysql-import
var importer = new Importer({host, user, password, database});

// Get command line arguments
const args = process.argv.slice(2);
const file = args[0];

// Import a SQL file
importer.import(file)
    .then(function() {
      console.log('Imported');
      showData();
    })
    .catch(function(err) {
      console.log(err);
      exit;
    });
// Exit node process

function showData() {
  // Connnected to database
  const connection = mysql.createConnection(CLEARDB_DATABASE_URL);

  // Query department table
  connection.query(
      'SELECT * FROM departments', function(error, results, fields) {
        if (error)
          throw error;
        console.log("------------------ Departments ------------------");
        console.log("Name");
        for (var i = 0; i < results.length; i++) {
          // Log department table
          console.log(results[i].name);
        }
      });

  // Query role table
  connection.query('SELECT * FROM roles', function(error, results, fields) {
    if (error)
      throw error;
    console.log("------------------ Roles ------------------");
    console.log("Name");
    for (let i = 0; i < results.length; i++) {
      // Loop through results and print out each role
      console.log(results[i].title);
    }
  });
  console.log("\n");
  // Query employee table and join with role and department and manager
  let query =
      'SELECT e.id, e.first_name, e.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(m.first_name, " ", m.last_name) AS manager from employees e LEFT JOIN employees m ON e.manager_id = m.id LEFT JOIN roles ON e.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id';
  connection.query(query, function(error, results, fields) {
    if (error)
      throw error;
    console.log("------------------ Employees ------------------");
    console.log(
        "ID | First Name | Last Name | Role | Department | Salary | Manager");

    for (let i = 0; i < results.length; i++) {
      console.log(results[i].id + " | " + results[i].first_name + " | " +
                  results[i].last_name + " | " + results[i].title + " | " +
                  results[i].department + " | " + results[i].salary + " | " +
                  results[i].manager);
    }
  });

  // node native promisif

  connection.end();
  exit;
}
