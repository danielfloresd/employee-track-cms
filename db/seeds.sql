/* Trucate tables */


/* Clean database */
UPDATE EMPLOYEES set MANAGER_ID = NULL, role_id = NULL;
DELETE FROM EMPLOYEES;
DELETE FROM ROLES;
DELETE FROM DEPARTMENTS;

/* Set AUTO_INCREMENT to 1 */
ALTER TABLE employees AUTO_INCREMENT = 1;
ALTER TABLE roles AUTO_INCREMENT = 1;
ALTER TABLE departments AUTO_INCREMENT = 1;

/* departmentss */
INSERT INTO departments (name) VALUES ("Engineering");
INSERT INTO departments (name) VALUES ("Sales");
INSERT INTO departments (name) VALUES ("Marketing");
INSERT INTO departments (name) VALUES ("Administration");
INSERT INTO departments (name) VALUES ("Executive");

/* Add roless */
INSERT INTO roles (title, salary, department_id) VALUES ("Engineering Manager", 80000, (select id from departments where name = "Engineering"));
INSERT INTO roles (title, salary, department_id) VALUES ("Engineering Technician", 40000, (select id from departments where name = "Engineering"));

INSERT INTO roles (title, salary, department_id) VALUES ("Sales Manager", 80000, (select id from departments where name = "Sales"));
INSERT INTO roles (title, salary, department_id) VALUES ("Sales Rep", 30000, (select id from departments where name = "Sales"));

INSERT INTO roles (title, salary, department_id) VALUES ("Marketing Manager", 80000, (select id from departments where name = "Marketing"));

INSERT INTO roles (title, salary, department_id) VALUES ("Administration Manager", 80000, (select id from departments where name = "Administration"));

INSERT INTO roles (title, salary, department_id) VALUES ("CEO", 800000, (select id from departments where name = "Executive"));
INSERT INTO roles (title, salary, department_id) VALUES ("Director", 400000, (select id from departments where name = "Executive"));

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("John", "Smith", (select id from roles where title = "CEO"), null);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Jane", "Doe", (select id from roles where title = "Director"),1);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Steven", "Vesterdal", (select id from roles where title = "Engineering Manager"), 2);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Miguel", "Soto", (select id from roles where title = "Sales Manager"), 2);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Daniel", "Flores", (select id from roles where title = "Marketing Manager"), 2);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Lucia", "Flores", (select id from roles where title = "Administration Manager"), 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Johnny", "Smith", (select id from roles where title = "Engineering Technician"), 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Johnny", "Samuels", (select id from roles where title = "Sales Rep"), 4);