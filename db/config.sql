

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
    salary DECIMAL(10,2) NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

/* Create employees table with key, first_name, last_name, role_id, and manager_id columns */
CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);
/* Insert Sales, Engineering, and Legal departments */
INSERT INTO departments (name) VALUES ('Sales');
INSERT INTO departments (name) VALUES ('Engineering');
INSERT INTO departments (name) VALUES ('Legal');

/* Insert Lead Engineer, Legal Team Lead, Accountant, Sales Lead, Salesperson, Software Engineer and Lawer roles */
/* Insert into roles 'Lead Engineer' with salary 100000 and department 'Engineering' */


INSERT INTO roles (title, salary, department_id) VALUES ('Lead Engineer', 100000, 14);
INSERT INTO roles (title, salary, department_id) VALUES ('Legal Team Lead', 80000, 24);
INSERT INTO roles (title, salary, department_id) VALUES ('Accountant', 75000, 4);
INSERT INTO roles (title, salary, department_id) VALUES ('Sales Lead', 80000, 4);
INSERT INTO roles (title, salary, department_id) VALUES ('Salesperson', 40000, 4);
INSERT INTO roles (title, salary, department_id) VALUES ('Software Engineer', 60000, 14);
INSERT INTO roles (title, salary, department_id) VALUES ('Lawyer', 120000, 24);

/* Insert employees */
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, 1);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Jane', 'Doe', 2, 2);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('John', 'Smith', 3, 1);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Jane', 'Smith', 4, 1);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Johnny', 'Doep', 5, 1);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Janet', 'Doep', 6, 2);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Johnny', 'Smithp', 7, 1);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Janet', 'Smithp', 7, 2);

/* Insert employees */
INSERT INTO employees (first_name, last_name, role_id, ) VALUES ('John', 'Doe', 14);
INSERT INTO employees (first_name, last_name, role_id, ) VALUES ('Jane', 'Doe', 14);
INSERT INTO employees (first_name, last_name, role_id, ) VALUES ('John', 'Smith', 4);
INSERT INTO employees (first_name, last_name, role_id, ) VALUES ('Jane', 'Smith', 24);
INSERT INTO employees (first_name, last_name, role_id, ) VALUES ('Johnny', 'Doep', 44);
INSERT INTO employees (first_name, last_name, role_id, ) VALUES ('Janet', 'Doep', 54);
INSERT INTO employees (first_name, last_name, role_id, ) VALUES ('Johnny', 'Smithp', 64);
INSERT INTO employees (first_name, last_name, role_id, ) VALUES ('Janet', 'Smithp', );

/* Select for creating tables in SQL Workbench */
SELECT * FROM departments;
SELECT * FROM roles;
SELECT * FROM employees;