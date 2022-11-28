// Require mysql
var mysql = require('mysql');
// Create db connection class
class DBConnection {

    constructor() {
        const user = 'root';
        const password = 'mysql';
        const host = 'localhost';
        this.connection = mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: 'employee_track_cms'
        });

        this.connection.connect(function (err) {
            if (err) throw err;
        });
    };

    static getInstance() {
        if (!DBConnection.instance) {
            DBConnection.instance = new DBConnection();
        }
        return DBConnection.instance;
    }

    static connection() {

    }


}
// Create method to query database
module.exports = DBConnection;