let EMPLOYEES = [];
let DEPARTMENTS = [];
let ROLES = [];
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
  })
    .then((response) => response.json())
    .then((data) => {
      // Reload web page
      location.reload();
    })
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
      let salary = $("<td>").text(
        role.salary.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })
      );
      let department = $("<td>").text(role.department);

      row.append(title);
      row.append(salary);
      row.append(department);

      // Add double click event to row
      row.dblclick(function () {
        editRole(role);
      });

      $("#roles-table").append(row);
    }
  });
};

const loadDepartments = () => {
  $("#departments-table").empty();
  getDepartments().then((data) => {
    DEPARTMENTS = data;
    for (let i = 0; i < data.length; i++) {
      let li = $("<li>")
        .append(
          $("<button>").addClass("btn btn-info btn-block").text(data[i].name)
        )
        .attr("id", data[i].id)
        .click(function () {
          selectDepartment(data[i]);
        });
      $("#employees").append(li);

      // Add row to departments table
      let num_emplpoyees = EMPLOYEES.filter(
        (e) => e.department == data[i].name
      ).length;
      let budget = EMPLOYEES.filter((e) => e.department == data[i].name).reduce(
        (a, b) => a + b.salary,
        0
      );
      let row = $("<tr>");
      row.append($("<td>").text(data[i].name));
      row.append($("<td>").text(num_emplpoyees));
      row.append(
        $("<td>").text(
          budget.toLocaleString("en-US", { style: "currency", currency: "USD" })
        )
      );

      // Add double click event to row
      row.dblclick(function () {
        editDepartment(data[i]);
      });

      $("#departments-table").append(row);
    }
  });
};

const initDepartments = () => {
  getEmployees().then((data) => {
    EMPLOYEES = data;
    selectDepartment();
  });

  loadRoles();
  loadDepartments();

  // Add button to show all employees
  let li = $("<li>")
    .append($("<button>").addClass("btn btn-info btn-block").text("All"))
    .attr("id", "all")
    .click(function () {
      selectDepartment();
    });
  $("#employees").append(li);

  // Add listner on button to add employee
  $("#employee-add").click(function () {
    let employee = {
      id: 0,
      first_name: "",
      last_name: "",
      role_id: 0,
      manager_id: 0,
    };
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
};

const selectDepartment = (department) => {
  $("#employee-table").empty();

  let employees = !department
    ? EMPLOYEES
    : EMPLOYEES.filter((employee) => employee.department === department.name);

  // Add icon to first column

  for (let i = 0; i < employees.length; i++) {
    let employee = employees[i];
    let tr = $("<tr>");

    let td = $("<td>").text(employee.first_name);
    tr.append(td);
    td = $("<td>").text(employee.last_name);
    tr.append(td);

    td = $("<td>").text(employee.title);
    tr.append(td);

    // Fromat salary as currency
    let salary = employee.salary
      ? employee.salary.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })
      : "";
    td = $("<td>").text(salary);
    tr.append(td);

    td = $("<td>").text(employee.department);
    tr.append(td);

    td = $("<td>").text(employee.manager);
    tr.append(td);

    let tdActions = $("<td>");

    let deleteButton = $("<button>")
      .addClass("btn btn-outline-danger btn-sm")
      // .text("Delete")
      .click(function () {
        deleteEmployee(employee);
      });
    // Add icon to button
    deleteButton.prepend($("<i>").addClass("fas fa-trash-alt"));
    tdActions.append(deleteButton);

    // tr.append(tdActions);
    // Add double click event to row
    tr.dblclick(function () {
      editEmployee(employee);
    });
    $("#employee-table").append(tr);
  }
};

const selectEmplyee = (employee) => {
  $("#employee-card").empty();
  let card = createEployeeCard(employee);
  $("#employee-card").append(card);
};

const editEmployee = (employee) => {
  let card = createEployeeCard(employee);
  $("#modal-employee").empty();
  $("#modal-employee").append(card);
  $("#modal").modal("show");
};

const addEmployee = (employee) => {
  let card = createNewEmployeeCard(employee);
  $("#modal-employee").empty();
  $("#modal-employee").append(card);
  $("#modal").modal("show");
};

const editRole = (role) => {
  let card = createRoleCard(role);
  $("#modal-employee").empty();
  $("#modal-employee").append(card);
  $("#modal").modal("show");
};

const addRole = (role) => {
  let card = createNewRoleCard(role);
  $("#modal-employee").empty();
  $("#modal-employee").append(card);
  $("#modal").modal("show");
};

const editDepartment = (department) => {
  let card = createDepartmentCard(department);
  $("#modal-employee").empty();
  $("#modal-employee").append(card);
  $("#modal").modal("show");
};

const addDepartment = (department) => {
  let card = createNewDepartmentCard(department);
  $("#modal-employee").empty();
  $("#modal-employee").append(card);
  $("#modal").modal("show");
};

const createActionButtons = (obj, saveFunc, deleteFunc) => {
  // Add save and cancel buttons
  let saveButton = $("<button>")
    .addClass("btn btn-info")
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

const createEployeeCard = (employee) => {
  let card = $("<div>")
    // .attr("style", "width: 18rem;")
    .addClass("card");
  let cardBody = $("<div>").addClass("card-body");
  let cardIcon = $("<i>").addClass("fas fa-user fa-10x");
  let cardTitle = $("<h3>")
    .addClass("card-title")
    .text(employee.first_name + " " + employee.last_name);
  let role = employee.title ? employee.title : "Select";
  let department = employee.department ? employee.department : "Select";
  let manager = employee.manager ? employee.manager : "Select";

  let labelRole = $("<p>")
    // .addClass("card-subtitle mb-2 text-muted")
    .attr("style", "margin-top: 2px; width: 100px;")
    .text("Role");

  let role_options = ROLES.map((role) => role.title);
  let cardRoleDropdown = createDropDown("title", role, role_options, employee);
  let labelDepartment = $("<p>")
    // .addClass("card-subtitle mb-2 text-muted")
    .attr("style", "margin-top: 2px; width: 100px;")
    .text("Department");
  // let cardDepartmentDropdown = createDropDown(department);
  let cardDepartmentDropdown = $("<p>")
    // .addClass("card-subtitle mb-2 text-muted")
    .attr("style", "margin-top: 2px; width: 100px;")
    .text(department);

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
  let cardButtons = $("<div>").addClass("btn-group-vertical");

  let cardRoleGroup = $("<div>").addClass("btn-group");
  cardRoleGroup.append(labelRole, cardRoleDropdown);

  let cardDepartmentGroup = $("<div>").addClass("btn-group");
  cardDepartmentGroup.append(labelDepartment, cardDepartmentDropdown);

  let cardManagerGroup = $("<div>").addClass("btn-group");
  cardManagerGroup.append(labelManager, cardManagerDropdown);

  // Format employee salary to USD
  let formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });
  let cardSalary = $("<p>")
    .addClass("card-text")
    .text("Salary: " + formatter.format(employee.salary));

  cardBody.append(cardIcon, cardTitle, cardSalary);
  cardDepartmentGroup.append(labelDepartment, cardDepartmentDropdown);
  cardButtons.append(cardRoleGroup, cardDepartmentGroup, cardManagerGroup);
  // Add save and cancel buttons
  createActionButtons(employee, saveEmployee, deleteEmployee);

  cardBody.append(cardButtons);
  card.append(cardBody);
  return card;
};

const createNewEmployeeCard = (employee) => {
  let card = $("<div>")
    // .attr("style", "width: 18rem;")
    .addClass("card");
  let cardBody = $("<div>").addClass("card-body");
  let cardIcon = $("<i>").addClass("fas fa-user fa-10x");
  let cardTitle = $("<h3>").addClass("card-title").text("Add User");
  // Add first name input with label
  let labelFirstName = $("<label>")
    // .addClass("card-subtitle mb-2 text-muted")
    .attr("style", "margin-top: 2px; width: 100px;")
    .text("First Name");
  let cardFirstName = $("<input>")
    .attr("type", "text")
    .attr("id", "first_name")
    .attr("value", employee.first_name)
    .attr("style", "width: 150px;");
  // Add last name input with label
  let labelLastName = $("<label>")
    // .addClass("card-subtitle mb-2 text-muted")
    .attr("style", "margin-top: 2px; width: 100px;")
    .text("Last Name");
  let cardLastName = $("<input>")
    .attr("type", "text")
    .attr("id", "last_name")
    .attr("value", employee.last_name)
    .attr("style", "width: 150px;");
  // Add labels and inputs to div
  let cardNameGroup = $("<div>").addClass("btn-group");
  cardNameGroup.append(labelFirstName, cardFirstName);
  // Add last name  group
  let cardLastNameGroup = $("<div>").addClass("btn-group");
  cardLastNameGroup.append(labelLastName, cardLastName);

  let role = employee.title ? employee.title : "Select";
  let manager = employee.manager ? employee.manager : "Select";

  let labelRole = $("<p>")
    // .addClass("card-subtitle mb-2 text-muted")
    .attr("style", "margin-top: 2px; width: 100px;")
    .text("Role");

  let role_options = ROLES.map((role) => role.title);
  let cardRoleDropdown = createDropDown("title", role, role_options, employee);

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
  let cardButtons = $("<div>").addClass("btn-group-vertical");

  let cardRoleGroup = $("<div>").addClass("btn-group");
  cardRoleGroup.append(labelRole, cardRoleDropdown);

  let cardManagerGroup = $("<div>").addClass("btn-group");
  cardManagerGroup.append(labelManager, cardManagerDropdown);

  cardBody.append(cardIcon, cardTitle);
  cardButtons.append(
    cardNameGroup,
    cardLastNameGroup,
    cardRoleGroup,
    cardManagerGroup
  );
  // Add save and cancel buttons
  let saveButton = $("<button>")
    .addClass("btn btn-info")
    // .text("Save")
    .click(function () {
      // Set employee properties
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
      $("#modal").modal("hide");
    });

  addSaveAndCancelButtons(saveButton);

  cardBody.append(cardButtons);
  card.append(cardBody);
  return card;
};

const createDropDown = (key, label, options, employee) => {
  let dropdown = $("<div>").addClass("dropdown");
  let select = $("<select>").addClass("form-control").attr("id", key);

  let defaultOption = $("<option>").attr("selected", "selected").text(label);
  select.append(defaultOption);
  for (let i = 0; i < options.length; i++) {
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
  let card = $("<div>").addClass("card");
  // .attr("style", "width: 18rem;");

  let cardBody = $("<div>").addClass("card-body");
  let cardIcon = $("<i>").addClass("fas fa-user fa-10x");
  let cardTitle = $("<h4>").addClass("card-title").text(department.name);

  let budget = EMPLOYEES.filter(
    (employee) => employee.department === department.name
  ).reduce((total, employee) => total + employee.salary, 0);

  // Format employee salary to USD
  let formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });
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

  card.append(cardBody);
  // Add action buttons
  createActionButtons(department, saveDepartment, deleteDepartment);
  return card;
};

const createNewDepartmentCard = (department) => {
  let card = $("<div>").addClass("card");
  // .attr("style", "width: 18rem;");
  let cardBody = $("<div>").addClass("card-body");
  let cardIcon = $("<i>").addClass("fas fa-user fa-10x");
  let cardTitle = $("<h4>").addClass("card-title").text("New Department");
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
    .addClass("btn btn-info")
    // .text("Save")
    .click(function () {
      // Set employee properties
      department.name = $("#department").val();
      newDepartment(department);
      $("#modal").modal("hide");
    });

  addSaveAndCancelButtons(saveButton);

  cardBody.append(cardButtons);
  card.append(cardBody);
  return card;
};

const createRoleCard = (role) => {
  let card = $("<div>").addClass("card").attr("style", "width: 18rem;");

  let cardBody = $("<div>").addClass("card-body");
  let cardIcon = $("<i>").addClass("fas fa-user fa-10x");
  let cardTitle = $("<h4>").addClass("card-title").text(role.title);

  let department = role.department ? role.department : "Select";

  let labelDepartment = $("<p>")
    // .addClass("card-subtitle mb-2 text-muted")
    .attr("style", "margin-top: 10px; width: 100px;")
    .text("Department");
  // let cardDepartmentDropdown = createDropDown(department);
  let cardDepartmentDropdown = createDropDown(
    "department",
    department,
    DEPARTMENTS.map((department) => department.name),
    role
  );

  let cardButtons = $("<div>").addClass("btn-group-vertical");

  let cardDepartmentGroup = $("<div>").addClass("btn-group");
  cardDepartmentGroup.append(labelDepartment, cardDepartmentDropdown);

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
  cardDepartmentGroup.append(labelDepartment, cardDepartmentDropdown);
  cardButtons.append(cardDepartmentGroup);
  cardBody.append(cardButtons);
  // Create save and delete buttons
  createActionButtons(role, saveRole, deleteRole);
  card.append(cardBody);
  return card;
};

const createNewRoleCard = (role) => {
  let card = $("<div>").addClass("card");
  // .attr("style", "width: 18rem;");
  let cardBody = $("<div>").addClass("card-body");
  let cardIcon = $("<i>").addClass("fas fa-user fa-10x");
  let cardTitle = $("<h4>").addClass("card-title").text("New Role");
  let labelTitle = $("<p>")
    .attr("style", "margin-top: 10px; width: 100px;")
    .text("Title");
  let cardTitleInput = $("<input>")
    .addClass("form-control")
    .attr("id", "title")
    .attr("placeholder", "Enter role title");
  let labelDepartment = $("<p>")
    .attr("style", "margin-top: 10px; width: 100px;")
    .text("Department");
  let cardDepartmentDropdown = createDropDown(
    "department",
    "Select",
    DEPARTMENTS.map((department) => department.name),
    role
  );
  let labelSalary = $("<p>")
    .attr("style", "margin-top: 10px; width: 100px;")
    .text("Salary");
  let cardSalaryInput = $("<input>")
    .attr("type", "number")
    .attr("id", "salary")
    .attr("placeholder", "Enter salary");
  let cardButtons = $("<div>").addClass("btn-group-vertical");
  let cardBreak = $("<br>");
  cardBody.append(cardIcon, cardTitle);
  // Create horizontal button group for title, department, and salary
  let cardTitleGroup = $("<div>").addClass("btn-group");
  cardTitleGroup.append(labelTitle, cardTitleInput);
  let cardDepartmentGroup = $("<div>").addClass("btn-group");
  cardDepartmentGroup.append(labelDepartment, cardDepartmentDropdown);
  let cardSalaryGroup = $("<div>").addClass("btn-group");
  cardSalaryGroup.append(labelSalary, cardSalaryInput);
  cardButtons.append(cardTitleGroup, cardDepartmentGroup, cardSalaryGroup);

  // Add save and cancel buttons
  let saveButton = $("<button>")
    .addClass("btn btn-info")
    // .text("Save")
    .click(function () {
      // Set employee properties
      role.title = $("#title").val();
      role.salary = $("#salary").val();
      role.department = $("#department").val();
      newRole(role);
      $("#modal").modal("hide");
    });

  addSaveAndCancelButtons(saveButton);
  cardBody.append(cardButtons, cardBreak);
  card.append(cardBody);
  return card;
};

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
