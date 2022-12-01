// Create Employee class with id, first_name, last_name, role_id, manager_id
// Require db_connection.js
const DBConnection = require('../src/db_connection');
const FORMATTER = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
});

class Employee {
    constructor(id, first_name, last_name, title, manager, salary, department) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.title = title;
        this.department = department;
        this.manager = manager;
        this.salary = salary;
    }

    name() {
        return this.first_name + ' ' + this.last_name;
    }

    getSalary() {
        return this.salary ? FORMATTER.format(this.salary) : "-";
    }

    getDepartment() {
        return this.department ? this.department : "-";
    }

    getManager() {
        return this.manager == "null" || !this.manager ? "-" : this.manager;
    }

    getTitle() {
        return this.title ? this.title : "-";
    }

    getDescription(include_manager = true, include_department = true) {
        let description = {
            ID: this.id,
            First_Name: this.first_name,
            Last_Name: this.last_name,
            Title: this.getTitle(),
            Salary: this.getSalary()
        };

        if (include_manager)
            description.Manager = this.getManager();
        if (include_department)
            description.Department = this.getDepartment();
        return description;
    }


    isManager() {
        // Reurn true if the employee is manager of other employees
       return Employee.getEmployeesByManagerId(this.id).then((employees) => {
            return employees.length > 0;
        });
    }

    static getEmployeesByManagerId(id) {
        // Connnected to database
        let connection = DBConnection.getInstance().connection;
        // Query database
        let promise = new Promise((resolve, reject) => {
            connection.query('SELECT * FROM employees WHERE manager_id = ?', [id], (err, res) => {
                if (err)
                    reject(err);
                resolve(res);
            });
        });
        // Return promise
        return promise;
    }

    static updateById(id, first_name, last_name, title, manager) {
        let connection = DBConnection.getInstance().connection;
        // Update employee role_id by title
        let query = 'UPDATE employees SET role_id = (SELECT id FROM roles WHERE title = ?) WHERE id = ?';
        // Query database
        let promise = new Promise((resolve, reject) => {
            connection.query(query, [title, id], (err) => {
                if (err)
                    reject(err);
                // Update employee manager_id by manager name
                // Find manager id by manager name
                let query = 'SELECT id FROM employees WHERE CONCAT(first_name, " ", last_name) = ?';
                connection.query(query, [manager], (err, res) => {
                    if (err) throw err;
                    // Update employee manager_id by manager id
                    let query = 'UPDATE employees SET manager_id = ? WHERE id = ?';
                    connection.query(query, [res[0].id, id], (err) => {
                        if (err) throw err;
                        // Update employee first_name and last_name
                        let query = 'UPDATE employees SET first_name = ?, last_name = ? WHERE id = ?';
                        connection.query(query, [first_name, last_name, id], (err, res) => {
                            if (err) throw err;
                            resolve(res);
                        });
                    });
                });
            });
        });
        return promise;
    }



    // Create method update employee in database    
    static updateRole(id, role_id) {
        // Connnected to database
        let connection = DBConnection.getInstance().connection;
        let query = 'UPDATE employees SET role_id = ? WHERE id = ?';
        // Query database
        let promise = new Promise((resolve, reject) => {
            connection.query(query, [role_id, id], (err, res) => {
                if (err)
                    reject(err);
                resolve(res);
            });
        });
        // Return promise
        return promise;
    }

    static updateManager(id, manager_id) {
        // Connnected to database
        let connection = DBConnection.getInstance().connection;
        let query = 'UPDATE employees SET manager_id = ? WHERE id = ?';
        // Query database
        let promise = new Promise((resolve, reject) => {
            connection.query(query, [manager_id, id], (err, res) => {
                if (err)
                    reject(err);
                resolve(res);
            });
        });
        // Return promise
        return promise;
    }

    static create(first_name, last_name, role_id, manager_id) {
        // Connnected to database
        let connection = DBConnection.getInstance().connection;

        // Create promise to create employee in the database
        let promise = new Promise((resolve, reject) => {
            connection.query('INSERT INTO employees SET ?',
                {
                    first_name: first_name,
                    last_name: last_name,
                    role_id: role_id,
                    manager_id: manager_id
                }, (err, res) => {
                    if (err)
                        reject(err);
                    resolve(res);
                });
        });

        // Return promise
        return promise;
    }

    static delete(full_name) {
        // Connnected to database
        let connection = DBConnection.getInstance().connection;
        let delete_query = 'DELETE FROM employees WHERE CONCAT(first_name, " ", last_name) = ?';
        let promise = new Promise((resolve, reject) => {
            // Find all employees by manager name with employee as manager
            let query = 'SELECT * FROM employees WHERE manager_id = (SELECT id FROM employees WHERE CONCAT(first_name, " ", last_name) = ?)';
            // Query database
            connection.query(query, [full_name], function (error, results) {
                if (error)
                    reject(error);
                // If there are employees with this manager
                if (results.length > 0) {
                    // Set their manager to null
                    let query = 'UPDATE employees SET manager_id = NULL WHERE manager_id IN (SELECT id FROM (SELECT id from employees WHERE CONCAT(first_name, " ", last_name) = ?) as t)';
                    connection.query(query, [full_name], function (error) {
                        if (error)
                            reject(error);
                        // Delete the employee
                        connection.query(delete_query, [full_name], function (error, results) {
                            if (error)
                                reject(error);
                            resolve(results);
                        });
                    });
                } else {
                    // Delete the employee
                    connection.query(delete_query, [full_name], function (error, results) {
                        if (error)
                            reject(error);
                        resolve(results);
                    });
                }
            });
        });
        // Return promise
        return promise;
    }
    static deleteById(id) {
        // Connnected to database
        let connection = DBConnection.getInstance().connection;
        let promise = new Promise((resolve, reject) => {
            // Find all employees by manager name with employee as manager
            let query = 'SELECT * FROM employees WHERE manager_id = ?';
            // Query database
            connection.query(query, [id], function (error, results) {
                if (error)
                    reject(error);
                // If there are employees with this manager
                if (results.length > 0) {
                    // Set their manager to null
                    let query = 'UPDATE employees SET manager_id = NULL WHERE manager_id = ?';
                    connection.query(query, [id], function (error) {
                        if (error)
                            reject(error);
                        // Delete the employee
                        let query = 'DELETE FROM employees WHERE id = ?';
                        connection.query(query, [id], function (error, results) {
                            if (error)
                                reject(error);
                            resolve(results);
                        });
                    });
                } else {
                    // Delete the employee
                    let query = 'DELETE FROM employees WHERE id = ?';
                    connection.query(query, [id], function (error, results, fields) {
                        if (error)
                            reject(error);
                        resolve(results);
                    });
                }
            });
        });
        // Return promise
        return promise;
    }



    static getAll() {
        // Connnected to database
        let connection = DBConnection.getInstance().connection;

        // Create promise to get all employees from the database
        let promise = new Promise((resolve, reject) => {
            let query = 'SELECT e.id, e.first_name, e.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(m.first_name, " ", m.last_name) AS manager from employees e LEFT JOIN employees m ON e.manager_id = m.id LEFT JOIN roles ON e.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id';
            connection.query(query, function (error, results) {
                if (error)
                    reject(error);
                let employees = [];
                for (let i = 0; i < results.length; i++) {

                    employees.push(
                        new Employee(
                            results[i].id,
                            results[i].first_name,
                            results[i].last_name,
                            results[i].title,
                            results[i].manager,
                            results[i].salary,
                            results[i].department));
                }
                resolve(employees);
            });
        }
        );
        return promise;
    }

}

module.exports = Employee;