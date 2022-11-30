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
INSERT INTO departments (name) VALUES ("Accounting");
INSERT INTO departments (name) VALUES ("Operations");
INSERT INTO departments (name) VALUES ("Legal");
INSERT INTO departments (name) VALUES ("Engineering");
INSERT INTO departments (name) VALUES ("Sales");
INSERT INTO departments (name) VALUES ("Marketing");
INSERT INTO departments (name) VALUES ("Administration");
INSERT INTO departments (name) VALUES ("Executive");

/* Add roless */

INSERT INTO roles (title, salary, department_id) VALUES ("Accounts Receivable Manager", 80000, (select id from departments where name = "Accounting"));
INSERT INTO roles (title, salary, department_id) VALUES ("Accounts Payable Manager", 80000, (select id from departments where name = "Accounting"));
INSERT INTO roles (title, salary, department_id) VALUES ("Accountant", 60000, (select id from departments where name = "Accounting"));
INSERT INTO roles (title, salary, department_id) VALUES ("Accounting Clerk", 40000, (select id from departments where name = "Accounting"));

INSERT INTO roles (title, salary, department_id) VALUES ("Operations Manager", 80000, (select id from departments where name = "Operations"));
INSERT INTO roles (title, salary, department_id) VALUES ("Operations Engineer", 40000, (select id from departments where name = "Operations"));
INSERT INTO roles (title, salary, department_id) VALUES ("Operations Technician", 30000, (select id from departments where name = "Operations"));

INSERT INTO roles (title, salary, department_id) VALUES ("Legal Manager", 80000, (select id from departments where name = "Legal"));
INSERT INTO roles (title, salary, department_id) VALUES ("Legal Clerk", 40000, (select id from departments where name = "Legal"));
INSERT INTO roles (title, salary, department_id) VALUES ("Lawyer", 30000, (select id from departments where name = "Legal"));

INSERT INTO roles (title, salary, department_id) VALUES ("Engineering Manager", 80000, (select id from departments where name = "Engineering"));
INSERT INTO roles (title, salary, department_id) VALUES ("Engineering Technician", 40000, (select id from departments where name = "Engineering"));
INSERT INTO roles (title, salary, department_id) VALUES ("Engineering Intern", 30000, (select id from departments where name = "Engineering"));

INSERT INTO roles (title, salary, department_id) VALUES ("Sales Manager", 80000, (select id from departments where name = "Sales"));
INSERT INTO roles (title, salary, department_id) VALUES ("Sales Associate", 40000, (select id from departments where name = "Sales"));
INSERT INTO roles (title, salary, department_id) VALUES ("Sales Rep", 30000, (select id from departments where name = "Sales"));

INSERT INTO roles (title, salary, department_id) VALUES ("Marketing Manager", 80000, (select id from departments where name = "Marketing"));
INSERT INTO roles (title, salary, department_id) VALUES ("Marketing Clerk", 40000, (select id from departments where name = "Marketing"));
INSERT INTO roles (title, salary, department_id) VALUES ("Marketing Intern", 30000, (select id from departments where name = "Marketing"));

INSERT INTO roles (title, salary, department_id) VALUES ("Administration Manager", 80000, (select id from departments where name = "Administration"));
INSERT INTO roles (title, salary, department_id) VALUES ("Administration Clerk", 40000, (select id from departments where name = "Administration"));
INSERT INTO roles (title, salary, department_id) VALUES ("Administration Intern", 30000, (select id from departments where name = "Administration"));

INSERT INTO roles (title, salary, department_id) VALUES ("CEO", 800000, (select id from departments where name = "Executive"));
INSERT INTO roles (title, salary, department_id) VALUES ("Director", 400000, (select id from departments where name = "Executive"));

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("John", "Smith", (select id from roles where title = "CEO"), null);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Jane", "Doe", (select id from roles where title = "Director"),4);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("John", "Doe", (select id from roles where title = "Director"), 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Jon", "ESmith", (select id from roles where title = "Operations Manager"), 14);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Jane", "Edwards", (select id from roles where title = "Legal Manager"), 14);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("John", "Olson", (select id from roles where title = "Engineering Manager"), 14);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Steven", "Vesterdal", (select id from roles where title = "Sales Manager"), 24);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Miguel", "Soto", (select id from roles where title = "Marketing Manager"), 24);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Daniel", "Flores", (select id from roles where title = "Administration Manager"), 24);
/* Add Accounting Manager */
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Lucia", "Flores", (select id from roles where title = "Accounts Receivable Manager"), 24);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Johnny", "Parker", (select id from roles where title = "Operations Engineer"),34);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Jane", "Parker", (select id from roles where title = "Operations Technician"),34);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Sam", "Nislen", (select id from roles where title = "Operations Technician"),34);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Isabella", "Smitson", (select id from roles where title = "Legal Clerk"), 44);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Michael", "Jordan", (select id from roles where title = "Lawyer"), 44);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Johnny", "Smith", (select id from roles where title = "Engineering Technician"), 54);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Jane", "Smith", (select id from roles where title = "Engineering Technician"), 54);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Sam", "Smith", (select id from roles where title = "Engineering Technician"), 54);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Johnny", "Samuels", (select id from roles where title = "Sales Associate"), 64);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Jane", "Samuels", (select id from roles where title = "Sales Associate"), 64);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Sam", "Samuels", (select id from roles where title = "Sales Associate"), 64);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Johnny", "Soto", (select id from roles where title = "Marketing Manager"), 74);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Jane", "Soto", (select id from roles where title = "Marketing Clerk"), 74);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Sam", "Soto", (select id from roles where title = "Marketing Intern"), 74);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Johnny", "Flores", (select id from roles where title = "Administration Manager"), 84);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Jane", "Flores", (select id from roles where title = "Administration Clerk"), 84);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Sam", "Flores", (select id from roles where title = "Administration Intern"), 84);



