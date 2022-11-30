// Require mysql
var mysql = require('mysql');
// const CLEARDB_DATABASE_URL =
// 'mysql://b0ca17fbc3e177:7b746377@us-cdbr-east-06.cleardb.net/heroku_2e86a661a20b463?reconnect=true';
// Create db connection class
const DATABASE_URL = process.env.DATABASE_URL ||
                     "mysql://root:mysql@localhost/employee_track_cms";

class DBConnection {

  constructor() {

    console.log("Connecting to database: " + DATABASE_URL);
    this.url = DATABASE_URL;
    this.connection = mysql.createPool(this.url);
    // this.connection = mysql.createConnection(DATABASE_URL);

    // this.connection.connect(function (err) {
    //     if (err) throw err;
    // });
  };

  static getInstance() {
    if (!DBConnection.instance) {
      DBConnection.instance = new DBConnection();
    }
    return DBConnection.instance;
  }
}
// Create method to query database
module.exports = DBConnection;