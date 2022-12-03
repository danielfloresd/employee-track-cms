// Require inquirer
const inquirer = require('inquirer');
// Require console.table
const cTable = require('console.table');
// Require figlet
const figlet = require('figlet');
// Require logger
const Logger = require("./src/logger");
// Require Employee class
const Employee = require('./lib/Employee');
const Role = require('./lib/Role');
const Department = require('./lib/Department');

let DEPARTMENTS = [];
let ROLES = [];
let EMPLOYEES = [];

const FORMATTER = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
});

const log = new Logger();

const load = () => {
    // Get all roles
    getEmployeeChoices();
    getRoleChoices();
    getDepartmentChoices();
}

function getDepartmentChoices() {
    DEPARTMENTS = [];
    Department.getAll().then((departments) => {
        departments.forEach((department) => {
            DEPARTMENTS.push(department);
        });
    });
    return DEPARTMENTS;
}

function getRoleChoices() {
    ROLES = [];
    Role.getAll().then((roles) => {

        roles.forEach((role) => {
            ROLES.push(role);
        });
    });
    return ROLES;
}

function getEmployeeChoices() {
    EMPLOYEES = [];
    Employee.getAll().then((employees) => {
        employees.forEach((employee) => {
            EMPLOYEES.push(employee);
        });
    });
    return EMPLOYEES;
}


const confirmDelete = (description, AClass) => {
    // Confirm that the user wants to delete the department
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: `Are you sure you want to delete the ${description}?`
        }]).then((answers) => {
            if (answers.confirm) {
                AClass.delete(description).then(() => {
                    log.red("Department deleted successfully!");
                    menu();
                });
            } else {
                menu();
            }
        });
}

const createAddEmployeeQuestions = () => {
    let role_choices = ROLES.map((role) => role.title);
    let manager_choices = EMPLOYEES.map((employee) => employee.first_name + " " + employee.last_name);
    manager_choices.push("None");
    let questions = [
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?"
        },
        {
            type: 'rawinput',
            name: 'lastName',
            message: "What is the employee's last name?"
        },
        {
            type: 'rawlist',
            name: 'role',
            message: "What is the employee's role?",
            choices: role_choices
        },
        {
            type: 'rawlist',
            name: 'manager',
            message: "Who is the employee's manager?",
            choices: manager_choices
        }
    ]
    return questions;
}
// ======================= EMPLOYEE SECTION =======================
const addEmployee = () => {

    // Get all employees
    inquirer.prompt(
        createAddEmployeeQuestions())
        .then((answers) => {

        let role = ROLES.find((role) => role.title == answers.role);

        let manager_id = null;
        if (answers.manager !== "None") {
            manager_id = EMPLOYEES.find((employee) => employee.first_name + " " + employee.last_name === answers.manager).id;
        }
        Employee.create(answers.firstName, answers.lastName, role.id, manager_id).then(() => {
            log.red("Employee added successfully!");
            load();
            menu();
        });

    });
}

const updateEmployeeRole = () => {
    // Get all employees
    let employee_choices = EMPLOYEES.map((employee) => employee.name());
    let role_choices = ROLES.map((role) => role.title);
    inquirer.prompt([
        {
            type: 'rawlist',
            name: 'employee',
            message: "Which employee's role would you like to update?",
            choices: employee_choices
        },
        {
            type: 'rawlist',
            name: 'role',
            message: "What is the employee's new role?",
            choices: role_choices
        }
    ]).then((answers) => {
        let role = ROLES.find((role) => role.title == answers.role);
        let employee = EMPLOYEES.find((employee) => employee.name() == answers.employee);
        Employee.updateRole(employee.id, role.id).then(() => {
            log.red("Employee role updated successfully!");
            load();
            menu();
        });
    });
}

const updateEmployeeManager = () => {
    // Get all employees
    let employee_choices = EMPLOYEES.map((employee) => employee.name());
    let manager_choices = EMPLOYEES.map((employee) => employee.name());
    manager_choices.push("None");
    inquirer.prompt([
        {
            type: 'rawlist',
            name: 'employee',
            message: "Which employee's manager would you like to update?",
            choices: employee_choices
        },
        {
            type: 'rawlist',
            name: 'manager',
            message: "Who is the employee's new manager?",
            choices: manager_choices
        }
    ]).then((answers) => {
        processEmployeeManager(answers);
    });
}

const processEmployeeManager = (answers) => {
    if (answers.manager === answers.employee) {
        log.red("An employee cannot be their own manager!");
        updateEmployeeManager();
        return;
    }

    let manager_id = null;
    if (answers.manager !== "None") {
        manager_id = EMPLOYEES.find((employee) => employee.name() == answers.manager).id;
    }
    let employee = EMPLOYEES.find((employee) => employee.name() == answers.employee);
    Employee.updateManager(employee.id, manager_id).then(() => {
        log.red("Employee manager updated successfully!");
        load();
        menu();
    });
}
const deleteEmployee = () => {
    log.red("Delete Employee");
    // Prompt user for employee information
    let choices = EMPLOYEES.map((employee) => employee.name());

    inquirer.prompt([
        {
            type: 'rawlist',
            name: 'name',
            message: "Which employee would you like to delete?",
            choices: choices
        }
    ]).then((answers) => {
        // Delete employee object
        // Confirm that the user wants to delete the employee
        confirmDelete(answers.name, Employee);
    });
}

const viewAllEmployees = () => {
    log.red("View All Employees");
    Employee.getAll().then((employees) => {
        log.white();
        console.table(employees.map((employee) => employee.getDescription()));
        menu();
    });
    // console.table(employees);
}

const viewAllEmployeesByManager = () => {
    log.red("View Employees By Manager");
    // Group all employees by their manager
    let managers = {};
    EMPLOYEES.forEach((employee) => {
        let manager = employee.getManager();
        if (!managers[manager])
            managers[manager] = [];
        managers[manager].push(employee.getDescription(false, true));
    });
    // Display the employees grouped by their manager
    for (let manager in managers) {
        log.white();
        console.group(manager);
        console.table(managers[manager]);
        console.groupEnd();
    }
    menu();
}

const viewAllManagers = () => {
    log.red("View All Managers");
    log.white();
    console.table(EMPLOYEES.filter((employee) => employee.isManager()).map((employee) => employee.getDescription()));
    menu();
}

const viewAllEmployeesByDepartment = () => {
    log.red("View All Employees By Department");
    Employee.getAll().then((employees) => {
        let employeesByDepartment = {};
        // Group employees by department using a map

        employees.forEach((employee) => {
            if (!employeesByDepartment[employee.department])
                employeesByDepartment[employee.department] = [];

            employeesByDepartment[employee.department].push(employee.getDescription(true, false));
        });

        // Print out the employees by department
        for (let department in employeesByDepartment) {
            console.group(department);
            // console.log(department);
            log.white();
            console.table(employeesByDepartment[department]);
            console.groupEnd();
        }

        menu();
    });
}

// ======================= END EMPLOYEE SECTION =======================
// ======================= ROLE SECTION =======================

const addRole = () => {
    log.red("Add Role");

    // Prompt user for role information
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: "What is the role's title?"
        },
        {
            type: 'input',
            name: 'salary',
            message: "What is the role's salary?"
        },
        {
            type: 'rawlist',
            name: 'department',
            message: "What is the role's department?",
            choices: DEPARTMENTS.map(department => department.name)
        }
    ]).then((answers) => {
        // Create new role object
        Role.create(answers.title, answers.salary, answers.department).then(() => {
            log.red("Role added successfully!");
            load();
            menu();
        });
    });
}

const deleteRole = () => {
    log.red("Delete Role");
    // Prompt user for role information
    let choices = ROLES.map(role => role.title);
    inquirer.prompt([
        {
            type: 'rawlist',
            name: 'name',
            message: "What is the role's title?",
            choices: choices
        }
    ]).then((answers) => {
        // Confirm role deletion
        confirmDelete(answers.name, Role);
    });
}

const viewAllRoles = () => {
    Role.getAll().then((roles) => {
        // Format the salary to be in dollars
        let roles_desc = roles.map((role) => role.getDescription());
        log.white();
        console.table(roles_desc);
        menu();
    });
}

// ======================= END ROLE SECTION =======================
// ======================= DEPARTMENT SECTION =======================
const addDepartment = () => {
    log.red("Add Department");
    // Prompt user for department information
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "What is the department's name?"
        }
    ]).then((answers) => {
        // Create new department object
        Department.create(answers.name).then(() => {
            log.red("Department added successfully!");
            load();
            menu();
        });
    });
}

const deleteDepartment = () => {
    log.red("Delete Department");
    // Prompt user for department information
    let choices = DEPARTMENTS.map(department => department.name);
    inquirer.prompt([
        {
            type: 'rawlist',
            name: 'name',
            message: "Which department would you like to delete?",
            choices: choices
        }
    ]).then((answers) => {
        // Delete department object
        // Confirm that the user wants to delete the department
        confirmDelete(answers.name, Department);
    });
}

const viewAllDepartments = () => {
    Department.getAll().then((departments) => {
        log.white();
        console.table(departments);
        menu();
    });
}

const viewDepartmentBudget = () => {
    log.red("View Department Budget");
    Employee.getAll().then((employees) => {
        let employeesByDepartment = {};
        // Group employees by department using a map
        let budgets = [];
        employees.forEach((employee) => {
            if (!employeesByDepartment[employee.department])
                employeesByDepartment[employee.department] = [];

            employeesByDepartment[employee.department].push(employee);
        });

        // Print out the employees by department
        for (let department in employeesByDepartment) {
            let departmentBudget = 0;
            employeesByDepartment[department].forEach((employee) => {
                departmentBudget += employee.salary;
            });
            // Format the budget to be in dollars
            budgets.push({
                Department: department,
                Budget: FORMATTER.format(departmentBudget)
            });
        }
        log.white();
        console.table(budgets);
        menu();
    });

}


const into = () => {

    log.yellow(
        figlet.textSync('Employee Track CMS', {
            // font: 'Ghost',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 80,
            whitespaceBreak: true
        }));
    log.red("Welcome to the Employee Tracker CMS");

}

const menuMap = {
    "View All Departments": viewAllDepartments,
    "View All Roles": viewAllRoles,
    "View All Employees": viewAllEmployees,
    "View All Employees By Manager": viewAllEmployeesByManager,
    "View All Employees By Department": viewAllEmployeesByDepartment,
    "Add Department": addDepartment,
    "Add Employee": addEmployee,
    "Add Role": addRole,
    "Update Employee Role": updateEmployeeRole,
    "Delete Department": deleteDepartment,
    "Delete Role": deleteRole,
    "Delete Employee": deleteEmployee,
    "View Department Budget": viewDepartmentBudget,
    "Update Employee Manager": updateEmployeeManager,
    "View All Managers": viewAllManagers,
}


const mainMenuQuestions = [
    {
        type: 'rawlist',
        message: 'What would you like to do?',
        name: "choice",
        choices: Object.keys(menuMap)
    }
]

const menu = () => {
    log.red("Please select from the following options");
    inquirer.prompt(mainMenuQuestions)
        .then((answers) => {
            if (menuMap[answers.choice]) {
                menuMap[answers.choice]();
            } else {
                log.red("Invalid choice");
                menu();
            }
        })
}

const init = () => {
    load();
    into();
    menu();
}

init();