// Create Department class with id, first_name, last_name, Department_id, manager_id
// Require db_connection.js
const DBConnection = require('../src/db_connection');

class Department {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    // Create method update Department in database
    update() {
        // Connnected to database
        let connection = DBConnection.getInstance().connection;
        // Create promise to update Department in the database
       return new Promise((resolve, reject) => {
            connection.query('UPDATE Department SET ? WHERE ?',
                [{
                    first_name: this.first_name,
                    last_name: this.last_name,
                    Department_id: this.Department_id,
                    manager_id: this.manager_id
                }, {
                    id: this.id
                }], (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                });
        });
    }

    static update(id, name) {
        // Connnected to database
        let connection = DBConnection.getInstance().connection;
        // Update the department
        let query = 'UPDATE departments SET name = ? WHERE id = ?';
        // Query database
       return new Promise((resolve, reject) => {
            connection.query(query, [name, id], (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });
    }

    static deleteById(id) {
        // Connnected to database
        let connection = DBConnection.getInstance().connection;
        // Query database
       return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM departments WHERE id = ?', [id], (err, res) => {
                if (err) reject(err);
                Department.delete(res[0].name).then((res) => {
                    resolve(res);
                });
            });
        });
    }

    static delete(name) {
        // Connnected to database
        let connection = DBConnection.getInstance().connection;
        // Update all employees with this role_id to null
        let query = 'UPDATE employees SET role_id = NULL WHERE role_id IN (SELECT id FROM roles WHERE department_id = (SELECT id FROM departments WHERE name = ?))';
        // Query database
       return new Promise((resolve, reject) => {
            connection.query(query, [name], (err) => {
                if (err) reject(err);
                // Delete the role
                let query = 'DELETE FROM roles WHERE department_id = (SELECT id FROM departments WHERE name = ?)';
                connection.query(query, [name], (err) => {
                    if (err) reject(err);
                    // Delete the department
                    let query = 'DELETE FROM departments WHERE name = ?';
                    connection.query(query, [name], (err, res) => {
                        if (err) reject(err);
                        resolve(res);
                    });
                });
            });
        });
    }

    static create(name) {
        // Connnected to database
        let connection = DBConnection.getInstance().connection;
        // Create promise to create Role in the database
       return new Promise((resolve, reject) => {
            connection.query('INSERT INTO departments SET ?', { name: name }, (err, res) => {
                if (err) reject(err);
                resolve(res);
            }
            );
        });
    }
    static getAll() {
        // Connnected to database
        let connection = DBConnection.getInstance().connection;
        // Create promise to get all Departments from the database
       return new Promise((resolve, reject) => {
            // Query Departments table and join with departments table
            let query = 'SELECT * FROM departments';
            connection.query(query, function (error, results) {
                if (error) reject(error);
                let departments = [];
                for (let i = 0; i < results.length; i++) {
                    let department = new Department(results[i].id, results[i].name);
                    departments.push(department);
                }
                resolve(departments);
            });
        });
    }

}

module.exports = Department;