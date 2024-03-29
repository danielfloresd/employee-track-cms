DROP DATABASE IF EXISTS employee_track_cms;
-- CREATE DATABASE employee_track_cms;

-- USE employee_track_cms;
/* Drop employees, roles, and employees tables */
DROP TABLE IF EXISTS departments, roles, employees;

/* Create department table with key and name columns */
CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

/* Create roles table with key, title, salary, and department_id columns */
CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL (10,
        2) NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES departments (id)
);

/* Create employees table with key, first_name, last_name, role_id, and manager_id columns */
CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES roles (id),
    FOREIGN KEY (manager_id) REFERENCES employees (id)
);
