// Create Role class with id, first_name, last_name, role_id, manager_id
// Require db_connection.js
const DBConnection = require('../src/db_connection');

class Role {
    constructor(id, title, salary, department) {
        this.id = id;
        this.title = title;
        this.department = department;
        this.salary = salary;
    }

    // Create method update Role in database
    update() {
        // Connnected to database
        let connection = DBConnection.getInstance().connection;

        // Create promise to update Role in the database
        let promise = new Promise((resolve, reject) => {
            connection.query('UPDATE Role SET ? WHERE ?',
                [{
                    first_name: this.first_name,
                    last_name: this.last_name,
                    role_id: this.role_id,
                    manager_id: this.manager_id
                }, {
                    id: this.id
                }],
                (err, res) => {
                    if (err) throw err;
                    resolve(res);
                }
            );
        });

        // Return promise
        return promise;
    }

    static update(id, title, salary, department) {
        // Connnected to database
        let connection = DBConnection.getInstance().connection;
        // Update the role and set department_id to the id of the department
        let query = 'UPDATE roles SET title = ?, salary = ?, department_id = (SELECT id FROM departments WHERE name = ?) WHERE id = ?';
        // Query database
        let promise = new Promise((resolve, reject) => {
            connection.query(query, [title, salary, department, id], (err, res) => {
                if (err) throw err;
                resolve(res);
            });
        });
        // Return promise
        return promise;
    }

    static deleteById(id) {
        // Connnected to database
        let connection = DBConnection.getInstance().connection;
        // Find the role title by id
        let query = 'SELECT title FROM roles WHERE id = ?';
        // Query database
        let promise = new Promise((resolve, reject) => {
            connection.query(query, [id], (err, res) => {
                if (err) throw err;
                // Call static delete method
                Role.delete(res[0].title).then((res) => {
                    resolve(res);
                });
            });
        });
        // Return promise
        return promise;
    }

    static delete(title) {
        // Connnected to database
        let connection = DBConnection.getInstance().connection;

        // Find all employees with this role by role title
        let query = 'SELECT * FROM employees LEFT JOIN roles ON employees.role_id = roles.id WHERE roles.title = ?';
        // Query database
        let promise = new Promise((resolve, reject) => {
            connection.query(query, [title], (err, res) => {
                if (err) throw err;
                // If there are employees with this role
                if (res.length > 0) {
                    // Set their role to null
                    let query = 'UPDATE employees SET role_id = NULL WHERE role_id = ?';
                    connection.query(query, [res[0].role_id], (err, res) => {
                        if (err) throw err;
                        // Delete the role
                        let query = 'DELETE FROM roles WHERE title = ?';
                        connection.query(query, [title], (err, res) => {
                            if (err) throw err;
                            resolve(res);
                        });
                    });
                } else {
                    // Delete the role
                    let query = 'DELETE FROM roles WHERE title = ?';
                    connection.query(query, [title], (err, res) => {
                        if (err) throw err;
                        resolve(res);
                    });
                }
            });
        });
        return promise;
    }

    static create(title, salary, department) {
        // Connnected to database
        let connection = DBConnection.getInstance().connection;

        // Create promise to create Role in the database
        let promise = new Promise((resolve, reject) => {
            connection.query('SELECT id FROM departments WHERE name = ?', [department], (err, res) => {
                if (err) throw err;
                let department_id = res[0].id;

                connection.query('INSERT INTO roles SET ?',
                    {
                        title: title,
                        salary: salary,
                        department_id: department_id
                    },
                    (err, res) => {
                        if (err) throw err;
                        resolve(res);
                    });
            });
        });
        return promise;
    }


    static getAll() {
        // Connnected to database
        let connection = DBConnection.getInstance().connection;

        // Create promise to get all Roles from the database
        let promise = new Promise((resolve, reject) => {
            // Query roles table and join with departments table
            let query = 'SELECT r.id,r.title,r.salary,r.department_id,d.name  FROM roles r LEFT JOIN departments d ON r.department_id = d.id';
            connection.query(query, function (error, results, fields) {
                if (error) throw error;
                let roles = [];
                for (let i = 0; i < results.length; i++) {
                    let role = new Role(results[i].id, results[i].title, results[i].salary, results[i].name);
                    roles.push(role);
                }
                resolve(roles);
            });
        }
        );
        return promise;
    }
}

module.exports = Role;