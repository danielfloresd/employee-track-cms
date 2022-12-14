let EMPLOYEES = [];
let DEPARTMENTS = [];
let ROLES = [];

// Global currency formatter
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});
const getDepartments = () => {
  return fetch("/api/departments")
    .then((response) => response.json())
    .then((data) => data);
};
const getEmployees = () => {
  return fetch("/api/employees")
    .then((response) => response.json())
    .then((data) => data);
};

const getRoles = () => {
  return fetch("/api/roles")
    .then((response) => response.json())
    .then((data) => data);
};

const getDatabaseURL = () => {
  return fetch("/api/database_url")
    .then((response) => response.json())
    .then((data) => {
      console.log("DATABASE_URL", data);
    });
};

const fetchAPI = (obj, met, table) => {
  const url = met == "POST" ? `/api/${table}` : `/api/${table}/${obj.id}`;
  fetch(url, {
    method: met,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  }).then(() => location.reload())
    .catch((error) => {
      console.error("Error:", error);
      alert(`Error ${met}ing ${table}`);
    });
};

const deleteEmployee = (employee) => {
  // Ask for confirmation
  let result = confirm(
    "Are you sure you want to delete " +
    employee.first_name +
    " " +
    employee.last_name +
    "?"
  );
  if (result) {
    fetchAPI(employee, "DELETE", "employees");
  }
};

const saveEmployee = (employee) => {
  fetchAPI(employee, "PUT", "employees");
};

const newEmployee = (employee) => {
  fetchAPI(employee, "POST", "employees");
};

const saveRole = (role) => {
  fetchAPI(role, "PUT", "roles");
};

const deleteRole = (role) => {
  fetchAPI(role, "DELETE", "roles");
};

const newRole = (role) => {
  console.log("New role:", role);
  fetchAPI(role, "POST", "roles");
};

const saveDepartment = (department) => {
  fetchAPI(department, "PUT", "departments");
};

const deleteDepartment = (department) => {
  fetchAPI(department, "DELETE", "departments");
};

// Create newDepartment function
const newDepartment = (department) => {
  fetchAPI(department, "POST", "departments");
};

const loadRoles = () => {
  $("#roles-table").empty();
  getRoles().then((data) => {
    ROLES = data;
    for (let i = 0; i < data.length; i++) {
      // Add row to roles-table
      let row = $("<tr>");
      let role = data[i];
      let title = $("<td>").text(role.title);
      // Format salary to currency
      let salary = $("<td>").text(formatter.format(role.salary));
      let department = $("<td>").text(role.department);

      row.append(title);
      row.append(salary);
      row.append(department);

      // Add double click event to row
      row.click(function () {
        editRole(role);
      });

      $("#roles-table").append(row);
    }
  });
};

const createDepartmentFilterButtons = (data) => {
  for (let i = 0; i < data.length; i++) {
    let btn = $("<a>")
      .addClass("dropdown-item")
      .text(data[i].name)
      .attr("id", data[i].id)
      .click(function () {
        selectDepartment(data[i]);
      });
    $("#departments-dropdown").append(btn);
  }
}

const createTotalBudgetRow = (total_budget) => {
  let row = $("<tr>");
  row.append($("<td>")
    .text("Total Budget"))
  row.append($("<td>").text(""));
  row.append(
    $("<td>").text(
      formatter.format(total_budget)
    )
  );
  $("#departments-table").append(row);
}
const loadDepartments = () => {
  $("#departments-table").empty();
  getDepartments().then((data) => {
    DEPARTMENTS = data;
    let total_budget = 0;
    createDepartmentFilterButtons(data);
    for (let i = 0; i < data.length; i++) {
      // Add row to departments table
      let num_emplpoyees = EMPLOYEES.filter(
        (e) => e.department == data[i].name
      ).length;
      let budget = EMPLOYEES.filter((e) => e.department == data[i].name).reduce(
        (a, b) => a + b.salary,
        0
      );
      total_budget += budget;
      let row = $("<tr>");
      row.append($("<td>").text(data[i].name));
      row.append($("<td>").text(num_emplpoyees));
      row.append($("<td>").text(formatter.format(budget)));

      // Add double click event to row
      row.click(function () {
        editDepartment(data[i]);
      });

      $("#departments-table").append(row);
    }
    // Add total budget as the last row
    createTotalBudgetRow(total_budget);
  });
};

const createAllEmployeesButton = () => {
  // Add button to show all employees
  let a = $("<a>")
    .addClass("dropdown-item")
    .text("All")
    .click(function () {
      selectDepartment();
    });
  $("#departments-dropdown").append(a);
}

const addAddListeners = () => {
  $("#employee-add").click(function () {
    let employee = {
      id: 0,
      first_name: "",
      last_name: "",
      role_id: 0,
      manager_id: 0,
    };
    console.log("Add employee:", employee);
    addEmployee(employee);
  });
  // Add listner on button to add department
  $("#departments-add").click(function () {
    let department = { id: 0, name: "" };
    addDepartment(department);
  });
  // Add listner on button to add role
  $("#roles-add").click(function () {
    let role = { id: 0, title: "", salary: 0, department: "" };
    addRole(role);
  });
}

const initDepartments = () => {
  getEmployees().then((data) => {
    EMPLOYEES = data;
    selectDepartment();
  });

  loadRoles();
  loadDepartments();
  createAllEmployeesButton();
  // Add listner on button to add employee
  addAddListeners();
};

const selectDepartment = (department) => {
  try {
    $("#employee-table").empty();
    let employees = !department
      ? EMPLOYEES
      : EMPLOYEES.filter((employee) => employee.department === department.name);
    let isMobile = window.innerWidth < 768;
    let columns = isMobile ? ["First Name", "Last Name", "Role", "Salary"] :
      ["First Name", "Last Name", "Role", "Salary", "Department", "Manager"];

    let header = $("<tr>");
    for (let i = 0; i < columns.length; i++) {
      let th = $("<th>").text(columns[i]);
      header.append(th);
    }
    $("#employee-table-header").empty();
    $("#employee-table-header").append(header);
    addIconToColumn();
    addEmployeeRows(employees);
    console.log("Department Selected")
  } catch (error) {
    console.error(error);
  }
};

const addIconToColumn = () => {
  // Add icon to first column
}

const addEmployeeRows = (employees) => {
  let isMobile = window.innerWidth < 768;
  for (let i = 0; i < employees.length; i++) {
    let employee = employees[i];
    let tr = $("<tr>");
    tr.append($("<td>").text(employee.first_name));
    tr.append($("<td>").text(employee.last_name));
    tr.append($("<td>").text(employee.title));
    tr.append($("<td>").text(employee.salary ? formatter.format(employee.salary) : ""));
    if (!isMobile) {
      tr.append($("<td>").text(employee.department));
      tr.append($("<td>").text(employee.manager));
    }
    // Add double click event to row
    tr.click(function () {
      editEmployee(employee);
    });
    $("#employee-table").append(tr);
  }
};

// const selectEmployee = (employee) => {
//   $("#employee-card").empty();
//   let card = createEmployeeCard(employee);
//   $("#employee-card").append(card);
// };

const appendCardToModal = (card) => {
  $("#modal-body").empty();
  $("#modal-body").append(card);
};

const editEmployee = (employee) => {
  let card = createEmployeeCard(employee);
  appendCardToModal(card);
  // Show modal
  $("#modal").modal("show");
};

const addEmployee = (employee) => {
  let card = createNewEmployeeCard(employee);
  appendCardToModal(card);
  // Show modal
  $("#modal").modal("show");
};

const editRole = (role) => {
  let card = createRoleCard(role);
  appendCardToModal(card);
  // Show modal
  $("#modal").modal("show");
};

const addRole = (role) => {
  let card = createNewRoleCard(role);
  appendCardToModal(card);
  // Show modal
  $("#modal").modal("show");
};

const editDepartment = (department) => {
  let card = createDepartmentCard(department);
  appendCardToModal(card);
  // Show modal
  $("#modal").modal("show");
};

const addDepartment = (department) => {
  let card = createNewDepartmentCard(department);
  appendCardToModal(card);
  // Show modal
  $("#modal").modal("show");
};

const createActionButtons = (obj, saveFunc, deleteFunc) => {
  // Add save and cancel buttons
  let saveButton = $("<button>")
    .addClass("btn btn-primary")
    // .text("Save")
    .click(function () {
      saveFunc(obj);
      $("#modal").modal("hide");
    });
  let cancelButton = $("<button>")
    .addClass("btn btn-secondary")
    // .text("Cancel")
    .click(function () {
      $("#modal").modal("hide");
    });
  // Create delete button
  let deleteButton = $("<button>")
    .addClass("btn btn-danger")
    // .text("Delete")
    .click(function () {
      deleteFunc(obj);
      $("#modal").modal("hide");
    });
  // Add icon to button
  saveButton.prepend($("<i>").addClass("fas fa-save"));
  cancelButton.prepend($("<i>").addClass("fas fa-window-close"));
  deleteButton.prepend($("<i>").addClass("fas fa-trash-alt"));
  // Create horizontal button group
  let buttonGroup = $("<div>").addClass("btn-group");
  buttonGroup.append(saveButton, deleteButton, cancelButton);

  // Add button group to modal footer
  $("#modal-footer").empty();
  $("#modal-footer").append(buttonGroup);
};

const createEmployeeRoleGroup = (employee) => {
  let role = employee.title ? employee.title : "Select";
  let role_options = ROLES.map((role) => role.title);
  let cardRoleDropdown = createDropDown("title", role, role_options, employee);
  let cardRoleGroup = $("<div>").addClass("btn-group");

  let labelRole = $("<p>")
    // .addClass("card-subtitle mb-2 text-muted")
    .attr("style", "margin-top: 2px; width: 100px;")
    .text("Role");

  cardRoleGroup.append(labelRole, cardRoleDropdown);
  return cardRoleGroup;
}

const createEmployeeDepartmentGroup = (employee) => {
  let department = employee.department ? employee.department : "Select";
  // Check if employee object is a Role class
  let labelDepartment = $("<p>")
    .attr("style", "margin-top: 2px; width: 100px;")
    .text("Department")
    .attr("style", "margin-top: 2px; width: 100px;")
    .text("Department");
  let cardDepartmentGroup = $("<div>").addClass("btn-group");
  let department_options = DEPARTMENTS.map((department) => department.name);
  let cardDepartmentDropdown = createDropDown("department", department, department_options, employee);
  cardDepartmentGroup.append(labelDepartment, cardDepartmentDropdown);
  return cardDepartmentGroup;
}

const createEmployeeManagerGroup = (employee) => {
  let manager = employee.manager ? employee.manager : "Select";
  let labelManager = $("<p>")
    // .addClass("card-subtitle mb-2 text-muted")
    .attr("style", "margin-top: 2px; width: 100px;")
    .text("Manager");
  let employee_options = EMPLOYEES.map(
    (employee) => employee.first_name + " " + employee.last_name
  );
  let cardManagerDropdown = createDropDown(
    "manager",
    manager,
    employee_options,
    employee
  );

  let cardManagerGroup = $("<div>").addClass("btn-group");
  cardManagerGroup.append(labelManager, cardManagerDropdown);
  return cardManagerGroup;
}

const createEmployeeCard = (employee) => {
  let card = $("<div>")
    .addClass("card");
  let cardHeader = $("<h2>").addClass("card-header").text("Employee");
  let cardBody = $("<div>").addClass("card-body");
  let cardIcon = $("<i>").addClass("fas fa-user fa-10x");
  let cardTitle = $("<h4>")
    .addClass("card-title")
    .text(employee.first_name + " " + employee.last_name);

  let cardButtons = $("<div>").addClass("btn-group-vertical");

  // Format employee salary to USD
  let cardSalary = $("<p>")
    .addClass("card-text")
    .text("Salary: " + formatter.format(employee.salary));

  cardBody.append(cardIcon, cardTitle, cardSalary);

  cardButtons.append(createEmployeeRoleGroup(employee));
  cardButtons.append(createEmployeeDepartmentGroup(employee));
  cardButtons.append(createEmployeeManagerGroup(employee));
  // Add save and cancel buttons
  createActionButtons(employee, saveEmployee, deleteEmployee);

  cardBody.append(cardButtons);
  card.append(cardHeader,cardBody);
  return card;
};

const createNewNameGroup = () => {
  let labelFirstName = $("<label>")
    // .addClass("card-subtitle mb-2 text-muted")
    .attr("style", "margin-top: 2px; width: 100px;")
    .text("First Name");
  let cardFirstName = $("<input>")
    .attr("type", "text")
    .attr("id", "first_name")
    .attr("style", "width: 150px;");
  // Add last name input with label
  let labelLastName = $("<label>")
    // .addClass("card-subtitle mb-2 text-muted")
    .attr("style", "margin-top: 2px; width: 100px;")
    .text("Last Name");
  let cardLastName = $("<input>")
    .attr("type", "text")
    .attr("id", "last_name")
    .attr("style", "width: 150px;");
  // Add labels and inputs to div
  let cardFirstNameGroup = $("<div>").addClass("btn-group");
  cardFirstNameGroup.append(labelFirstName, cardFirstName);
  let cardLastNameGroup = $("<div>").addClass("btn-group");
  cardLastNameGroup.append(labelLastName, cardLastName);

  let cardNameGroup = $("<div>").addClass("btn-horizontal-group");
  cardNameGroup.append(cardFirstNameGroup, cardLastNameGroup);

  return cardNameGroup;
}

const createNewRoleGroup = (employee) => {
  let labelRole = $("<p>")
    // .addClass("card-subtitle mb-2 text-muted")
    .attr("style", "margin-top: 2px; width: 100px;")
    .text("Role");

  let role_options = ROLES.map((role) => role.title);
  let cardRoleDropdown = createDropDown(
    "title",
    "Select",
    role_options,
    employee
  );

  let cardRoleGroup = $("<div>").addClass("btn-group");
  cardRoleGroup.append(labelRole, cardRoleDropdown);

  return cardRoleGroup;
}

const createNewManagerGroup = (employee) => {
  let labelManager = $("<p>")
    // .addClass("card-subtitle mb-2 text-muted")
    .attr("style", "margin-top: 2px; width: 100px;")
    .text("Manager");
  let employee_options = EMPLOYEES.map(
    (employee) => employee.first_name + " " + employee.last_name
  );
  let cardManagerDropdown = createDropDown(
    "manager",
    "Select",
    employee_options,
    employee
  );

  let cardManagerGroup = $("<div>").addClass("btn-group");
  cardManagerGroup.append(labelManager, cardManagerDropdown);
  return cardManagerGroup;
}

const createNewEmployeeCard = (employee) => {
  let card = $("<div>")
    .addClass("card");
  let cardHeader = $("<h2>").addClass("card-header").text("New Employee");
  let cardBody = $("<div>").addClass("card-body");
  let cardIcon = $("<i>").addClass("fas fa-user fa-10x");
  let cardTitle = $("<h4>").addClass("card-title").text("Add User");
  // Add first name input with label

  let cardButtons = $("<div>").addClass("btn-group-vertical");


  cardBody.append(cardIcon, cardTitle);
  cardButtons.append(
    createNewNameGroup(),
    createNewRoleGroup(employee),
    createNewManagerGroup(employee)
  );
  // Add save and cancel buttons
  let saveButton = $("<button>")
    .addClass("btn btn-primary")
    // .text("Save")
    .click(function () {
      saveNewEmployee(employee);
      $("#modal").modal("hide");

    });

  addSaveAndCancelButtons(saveButton);
  card.append(cardHeader,cardBody.append(cardButtons));
  return card;
};

const saveNewEmployee = (employee) => {
  employee.first_name = $("#first_name").val();
  employee.last_name = $("#last_name").val();
  // Get selected role
  let role = $("#title").val();
  let role_index = ROLES.findIndex((r) => r.title === role);
  employee.role_id = ROLES[role_index].id;
  // Get selected manager
  let manager = $("#manager").val();
  let manager_index = EMPLOYEES.findIndex(
    (e) => e.first_name + " " + e.last_name === manager
  );
  employee.manager_id = EMPLOYEES[manager_index].id;
  // Get selected department
  newEmployee(employee);
}

const createDropDown = (key, label, options, employee) => {
  let dropdown = $("<div>").addClass("dropdown");
  let select = $("<select>").addClass("form-control").attr("id", key);

  let defaultOption = $("<option>").attr("selected", "selected").text(label);
  select.append(defaultOption);
  for (let i = 0; i < options.length; i++) {
    // If option is equal to the default option continue
    if (options[i] === label) continue;
    let option = $("<option>").text(options[i]);
    select.append(option);
  }

  // Add listener to dropdown
  select.change(function () {
    employee[key] = $(this).val();
  });

  dropdown.append(select);
  return dropdown;
};

const createDepartmentCard = (department) => {
  let card = $("<div>")
    .addClass("card");
  let cardHeader = $("<h2>").addClass("card-header").text("Department");
  let cardBody = $("<div>").addClass("card-body");
  let cardIcon = $("<i>").addClass("fas fa-user fa-10x");
  let cardTitle = $("<h4>").addClass("card-title").text(department.name);

  let budget = EMPLOYEES.filter(
    (employee) => employee.department === department.name
  ).reduce((total, employee) => total + employee.salary, 0);

  let cardSalary = $("<p>")
    .addClass("card-text")
    .attr("style", "margin-top: 10px;")
    .text("Budget: " + formatter.format(budget));

  let cardNumberEmployees = $("<p>")
    .addClass("card-text")
    .attr("style", "margin-top: 10px;")
    .text(
      "Number of Employees: " +
      EMPLOYEES.filter((employee) => employee.department === department.name)
        .length
    );

  cardBody.append(cardIcon, cardTitle, cardSalary, cardNumberEmployees);

  card.append(cardHeader,cardBody);
  // Add action buttons
  createActionButtons(department, saveDepartment, deleteDepartment);
  return card;
};

const createNewDepartmentCard = (department) => {
  let card = $("<div>").addClass("card");
  // .attr("style", "width: 18rem;");
  let cardHeader = $("<h2>").addClass("card-header").text("New Department");
  let cardBody = $("<div>").addClass("card-body");
  let cardIcon = $("<i>").addClass("fas fa-user fa-10x");
  let cardTitle = $("<h4>").addClass("card-title")//.text("New Department");
  let labelDepartment = $("<p>")
    .attr("style", "margin-top: 10px; width: 100px;")
    .text("Department");
  let cardDepartment = $("<input>")
    .addClass("form-control")
    .attr("id", "department")
    .attr("placeholder", "Enter department name");
  let cardButtons = $("<div>").addClass("btn-group");

  cardBody.append(cardIcon, cardTitle);
  cardButtons.append(labelDepartment, cardDepartment);
  // Add save and cancel buttons
  let saveButton = $("<button>")
    .addClass("btn btn-primary")
    // .text("Save")
    .click(function () {
      // Set employee properties
      department.name = $("#department").val();
      newDepartment(department);
      $("#modal").modal("hide");
    });

  addSaveAndCancelButtons(saveButton);
  card.append(cardHeader,cardBody.append(cardButtons));
  return card;
};

const createRoleCard = (role) => {
  let card = $("<div>")
    .addClass("card")
  let cardHeader = $("<h2>").addClass("card-header").text("Role");
  let cardBody = $("<div>").addClass("card-body");
  let cardIcon = $("<i>").addClass("fas fa-user fa-10x");
  let cardTitle = $("<h4>").addClass("card-title").text(role.title);

  let cardButtons = $("<div>").addClass("btn-group-vertical");

  let cardSalary = $("<label>")
    .addClass("card-text")
    .attr("style", "margin-top: 10px; width: 100px;")
    .text("Salary $");
  let cardSalaryInput = $("<input>")
    .attr("type", "number")
    // .attr("placeholder", formatter.format(role.salary))
    .attr("style", "margin-top: 10px; width: 100px;")
    .val(role.salary);

  let cardBreak = $("<br>");

  cardBody.append(cardIcon, cardTitle, cardSalary, cardSalaryInput, cardBreak);

  cardButtons.append(createEmployeeDepartmentGroup(role));
  cardBody.append(cardButtons);
  // Create save and delete buttons
  createActionButtons(role, saveRole, deleteRole);
  card.append(cardHeader,cardBody);
  return card;
};

const createNewSalaryGroup = () => {
  let labelSalary = $("<p>")
    .attr("style", "margin-top: 10px; width: 100px;")
    .text("Salary");
  let cardSalaryInput = $("<input>")
    .attr("id", "salary")
    .attr("type", "number")
    .attr("placeholder", "Enter salary");
  let cardSalaryGroup = $("<div>").addClass("btn-group");
  cardSalaryGroup.append(labelSalary, cardSalaryInput);
  return cardSalaryGroup;
}

const createNewTitleGroup = () => {
  let labelTitle = $("<p>")
    .attr("style", "margin-top: 10px; width: 100px;")
    .text("Title");
  let cardTitleInput = $("<input>")
    .attr("id", "title")
    .addClass("form-control")
    .attr("placeholder", "Enter role title");
  let cardTitleGroup = $("<div>").addClass("btn-group");
  cardTitleGroup.append(labelTitle, cardTitleInput);
  return cardTitleGroup;
}

const createNewRoleCard = (role) => {
  let card = $("<div>")
    .addClass("card");
  let cardHeader = $("<h2>").addClass("card-header").text("New Role");
  let cardBody = $("<div>").addClass("card-body");
  let cardIcon = $("<i>").addClass("fas fa-user fa-10x");
  let cardTitle = $("<h4>").addClass("card-title");//.text("New Role");

  let cardButtons = $("<div>").addClass("btn-group-vertical");

  // Create horizontal button group for title, department, and salary

  cardButtons.append(createNewTitleGroup());
  cardButtons.append(createEmployeeDepartmentGroup(role));
  cardButtons.append(createNewSalaryGroup());

  // Add save and cancel buttons
  let saveButton = $("<button>")
    .addClass("btn btn-primary")
    // .text("Save")
    .click(function () {
      // Set employee properties
      saveRoleAction(role);
      $("#modal").modal("hide");
    });

  addSaveAndCancelButtons(saveButton);
  cardBody.append(cardIcon, cardTitle, cardButtons, $("<br>"));
  card.append(cardHeader,cardBody);
  return card;
};

const saveRoleAction = (role) => {
  role.title = $("#title").val();
  role.salary = $("#salary").val();
  role.department = $("#department").val();
  newRole(role);
}

const addSaveAndCancelButtons = (saveButton) => {
  let cancelButton = $("<button>")
    .addClass("btn btn-danger")
    // .text("Cancel")
    .click(function () {
      $("#modal").modal("hide");
    });
  // Add icon to button
  saveButton.prepend($("<i>").addClass("fas fa-save"));
  cancelButton.prepend($("<i>").addClass("fas fa-window-close"));
  // Create horizontal button group
  let buttonGroup = $("<div>").addClass("btn-group");
  buttonGroup.append(saveButton, cancelButton);
  // Add button group to modal footer
  $("#modal-footer").empty();
  $("#modal-footer").append(buttonGroup);
};

initDepartments();
getDatabaseURL();
