/* Trucate tables */
/* Clean database */
UPDATE
    EMPLOYEES
SET
    MANAGER_ID = NULL,
    role_id = NULL;

DELETE FROM EMPLOYEES;

DELETE FROM ROLES;

DELETE FROM DEPARTMENTS;

/* Set AUTO_INCREMENT to 1 */
ALTER TABLE employees AUTO_INCREMENT = 1;

ALTER TABLE roles AUTO_INCREMENT = 1;

ALTER TABLE departments AUTO_INCREMENT = 1;

/* departmentss */
INSERT INTO departments (name)
        VALUES ("Accounting");
INSERT INTO departments (name)
        VALUES ("Operations");
INSERT INTO departments (name)
        VALUES ("Legal");
INSERT INTO departments (name)
        VALUES ("Engineering");
INSERT INTO departments (name)
        VALUES ("Sales");
INSERT INTO departments (name)
        VALUES ("Marketing");
INSERT INTO departments (name)
        VALUES ("Administration");
INSERT INTO departments (name)
        VALUES ("Executive");
/* Add roless */
INSERT INTO roles (title, salary, department_id)
        VALUES ("Accounts Receivable Manager", 80000, (
                SELECT
                    id
                FROM
                    departments
                WHERE
                    name = "Accounting"));
INSERT INTO roles (title, salary, department_id)
        VALUES ("Accounts Payable Manager", 80000, (
                SELECT
                    id
                FROM
                    departments
                WHERE
                    name = "Accounting"));
INSERT INTO roles (title, salary, department_id)
        VALUES ("Accountant", 60000, (
                SELECT
                    id
                FROM
                    departments
                WHERE
                    name = "Accounting"));
INSERT INTO roles (title, salary, department_id)
        VALUES ("Accounting Clerk", 40000, (
                SELECT
                    id
                FROM
                    departments
                WHERE
                    name = "Accounting"));
INSERT INTO roles (title, salary, department_id)
        VALUES ("Operations Manager", 80000, (
                SELECT
                    id
                FROM
                    departments
                WHERE
                    name = "Operations"));
INSERT INTO roles (title, salary, department_id)
        VALUES ("Operations Engineer", 40000, (
                SELECT
                    id
                FROM
                    departments
                WHERE
                    name = "Operations"));
INSERT INTO roles (title, salary, department_id)
        VALUES ("Operations Technician", 30000, (
                SELECT
                    id
                FROM
                    departments
                WHERE
                    name = "Operations"));
INSERT INTO roles (title, salary, department_id)
        VALUES ("Legal Manager", 80000, (
                SELECT
                    id
                FROM
                    departments
                WHERE
                    name = "Legal"));
INSERT INTO roles (title, salary, department_id)
        VALUES ("Legal Clerk", 40000, (
                SELECT
                    id
                FROM
                    departments
                WHERE
                    name = "Legal"));
INSERT INTO roles (title, salary, department_id)
        VALUES ("Lawyer", 30000, (
                SELECT
                    id
                FROM
                    departments
                WHERE
                    name = "Legal"));
INSERT INTO roles (title, salary, department_id)
        VALUES ("Engineering Manager", 80000, (
                SELECT
                    id
                FROM
                    departments
                WHERE
                    name = "Engineering"));
INSERT INTO roles (title, salary, department_id)
        VALUES ("Engineering Technician", 40000, (
                SELECT
                    id
                FROM
                    departments
                WHERE
                    name = "Engineering"));
INSERT INTO roles (title, salary, department_id)
        VALUES ("Engineering Intern", 30000, (
                SELECT
                    id
                FROM
                    departments
                WHERE
                    name = "Engineering"));
INSERT INTO roles (title, salary, department_id)
        VALUES ("Sales Manager", 80000, (
                SELECT
                    id
                FROM
                    departments
                WHERE
                    name = "Sales"));
INSERT INTO roles (title, salary, department_id)
        VALUES ("Sales Associate", 40000, (
                SELECT
                    id
                FROM
                    departments
                WHERE
                    name = "Sales"));
INSERT INTO roles (title, salary, department_id)
        VALUES ("Sales Rep", 30000, (
                SELECT
                    id
                FROM
                    departments
                WHERE
                    name = "Sales"));
INSERT INTO roles (title, salary, department_id)
        VALUES ("Marketing Manager", 80000, (
                SELECT
                    id
                FROM
                    departments
                WHERE
                    name = "Marketing"));
INSERT INTO roles (title, salary, department_id)
        VALUES ("Marketing Clerk", 40000, (
                SELECT
                    id
                FROM
                    departments
                WHERE
                    name = "Marketing"));
INSERT INTO roles (title, salary, department_id)
        VALUES ("Marketing Intern", 30000, (
                SELECT
                    id
                FROM
                    departments
                WHERE
                    name = "Marketing"));
INSERT INTO roles (title, salary, department_id)
        VALUES ("Administration Manager", 80000, (
                SELECT
                    id
                FROM
                    departments
                WHERE
                    name = "Administration"));
INSERT INTO roles (title, salary, department_id)
        VALUES ("Administration Clerk", 40000, (
                SELECT
                    id
                FROM
                    departments
                WHERE
                    name = "Administration"));
INSERT INTO roles (title, salary, department_id)
        VALUES ("Administration Intern", 30000, (
                SELECT
                    id
                FROM
                    departments
                WHERE
                    name = "Administration"));
INSERT INTO roles (title, salary, department_id)
        VALUES ("CEO", 800000, (
                SELECT
                    id
                FROM
                    departments
                WHERE
                    name = "Executive"));
INSERT INTO roles (title, salary, department_id)
        VALUES ("Director", 400000, (
                SELECT
                    id
                FROM
                    departments
                WHERE
                    name = "Executive"));
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("John", "Smith", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "CEO"), NULL);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("Jane", "Doe", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Director"), 4);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("John", "Doe", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Director"), 4);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("Jon", "ESmith", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Operations Manager"), 14);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("Jane", "Edwards", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Legal Manager"), 14);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("John", "Olson", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Engineering Manager"), 14);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("Steven", "Vesterdal", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Sales Manager"), 24);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("Miguel", "Soto", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Marketing Manager"), 24);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("Daniel", "Flores", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Administration Manager"), 24);
/* Add Accounting Manager */
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("Lucia", "Flores", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Accounts Receivable Manager"), 24);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("Johnny", "Parker", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Operations Engineer"), 34);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("Jane", "Parker", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Operations Technician"), 34);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("Sam", "Nislen", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Operations Technician"), 34);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("Isabella", "Smitson", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Legal Clerk"), 44);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("Michael", "Jordan", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Lawyer"), 44);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("Johnny", "Smith", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Engineering Technician"), 54);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("Jane", "Smith", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Engineering Technician"), 54);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("Sam", "Smith", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Engineering Technician"), 54);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("Johnny", "Samuels", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Sales Associate"), 64);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("Jane", "Samuels", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Sales Associate"), 64);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("Sam", "Samuels", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Sales Associate"), 64);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("Johnny", "Soto", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Marketing Manager"), 74);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("Jane", "Soto", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Marketing Clerk"), 74);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("Sam", "Soto", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Marketing Intern"), 74);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("Johnny", "Flores", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Administration Manager"), 84);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("Jane", "Flores", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Administration Clerk"), 84);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ("Sam", "Flores", (
                SELECT
                    id
                FROM
                    roles
                WHERE
                    title = "Administration Intern"), 84);
