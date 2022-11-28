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

const log = new Logger();

const mainMenuQuestions = [
    {
        type: 'rawlist',
        name: 'mainMenu',
        message: 'What would you like to do?',
        name: "choice",
        choices: [
            "View All Empoyees",
            "View All Employees By Department",
            "Add Employee",
            "Update Employee Role",
            "Update Employee Manager",
            "View All Roles",
            "Add Role",
            "View All Departments",
            "Add Department",
            "Delete Department",
            "Delete Role",
            "Delete Employee",
            "View Department Budget"
        ]
    }
]

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
                    log.green("Department deleted successfully!");
                    menu();
                });
            } else {
                menu();
            }
        });
}

// ======================= EMPLOYEE SECTION =======================
const addEmployee = () => {
    
    // Get all employees
    let role_choices = ROLES.map((role) => role.title );
    let manager_choices = EMPLOYEES.map((employee) => employee.first_name + " " + employee.last_name);
    manager_choices.push("None");

    inquirer.prompt([
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
    ]).then((answers) => {
      
        let role = ROLES.find((role) => role.title == answers.role);
        
        let manager_id = null;
        if (answers.manager !== "None") {
            manager_id = EMPLOYEES.find((employee) => employee.first_name + " " + employee.last_name === answers.manager).id;
        }
        Employee.create(answers.firstName, answers.lastName, role.id, manager_id).then(() => {
            log.green("Employee added successfully!");
            load();
            menu();
        });
        
    });
}

const updateEmployeeRole = () => {
    // Get all employees
    let employee_choices = EMPLOYEES.map((employee) => employee.name());
    let role_choices = ROLES.map((role) => role.title );
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
            log.green("Employee role updated successfully!");
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

        if(answers.manager === answers.employee) {
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
            log.green("Employee manager updated successfully!");
            load();
            menu();
        });
    });
}
const deleteEmployee = () => {
    log.cyan("Delete Employee");
    // Prompt user for employee information
    let choices =  EMPLOYEES.map((employee) => employee.name());
 
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
    log.green("View All Employees");
    Employee.getAll().then((employees) => {
        // Format the salary to be in dollars
        employees.forEach((employee) => {
            employee.title = employee.getTitle();
            employee.department = employee.getDepartment();
            employee.manager = employee.getManager();
            employee.salary = employee.getSalary();
        });
        console.table(employees);
        menu();
    });
    // console.table(employees);
}

const viewAllEmployeesByDepartment = () => {
    log.green("View All Employees By Department");
    Employee.getAll().then((employees) => {
        let employeesByDepartment = {};
        // Group employees by department using a map

        employees.forEach((employee) => {
            if (!employeesByDepartment[employee.department])
                employeesByDepartment[employee.department] = [];

            employeesByDepartment[employee.department].push(employee);
        });

        // Print out the employees by department
        for (let department in employeesByDepartment) {
            console.group(department);
            // console.log(department);
            console.table(employeesByDepartment[department]);
            console.groupEnd();
        }

        menu();
    });
}

// ======================= END EMPLOYEE SECTION =======================
// ======================= ROLE SECTION =======================

const addRole = () => {
    log.cyan("Add Role");

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
            log.green("Role added successfully!");
            load();
            menu();
        });
    });
}

const deleteRole = () => {
    log.cyan("Delete Role");
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
        roles.forEach((role) => {
            role.salary = role.salary.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        });
        console.table(roles);
        menu();
    });
}

// ======================= END ROLE SECTION =======================
// ======================= DEPARTMENT SECTION =======================
const addDepartment = () => {
    log.cyan("Add Department");
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
            log.green("Department added successfully!");
            load();
            menu();
        });
    });
}

const deleteDepartment = () => {
    log.cyan("Delete Department");
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
        console.table(departments);
        menu();
    });
}

const viewDepartmentBudget = () => {
    log.cyan("View Department Budget");
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
                department: department,
                budget: departmentBudget.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
            });
        }
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
    log.green("Welcome to the Employee Tracker CMS");

}



const menu = () => {
    log.green("Please select from the following options");
    inquirer.prompt(mainMenuQuestions)
        .then((answers) => {
            switch (answers.choice) {
                case "View All Empoyees":
                    viewAllEmployees();
                    break;
                case "View All Employees By Department":
                    viewAllEmployeesByDepartment();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "Update Employee Manager":
                    updateEmployeeManager();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Delete Department":
                    deleteDepartment();
                    break;
                case "Delete Role":
                    deleteRole();
                    break;
                case "Delete Employee":
                    deleteEmployee();
                    break;
                case "View Department Budget":
                    viewDepartmentBudget();
                    break;
                default:
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