const { prompt } = require("inquirer");
const asciiartLogo = require("asciiart-logo");
const DB = require("./db/queries");
const { allowedNodeEnvironmentFlags } = require("process");
// const { updateEmployeeRole } = require("./db/queries");
require("console.table");

init();

function init() {
  const logoText = asciiartLogo({ name: "Employee Manager" }).render();
  console.log(logoText);
  loadPrompts();
}

function loadPrompts() {
  prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View all Employees",
          value: "VIEW_EMPLOYEES",
        },
        {
          name: "View all Departments",
          value: "VIEW_DEPARTMENTS",
        },
        {
          name: "View all Roles",
          value: "VIEW_ROLES",
        },
        {
          name: "Add a Role",
          value: "ADD_A_ROLE",
        },
        {
          name: "Add an Employee",
          value: "ADD_EMPLOYEE",
        },
        {
          name: "Add Department",
          value: "ADD_DEPARTMENT"
        },
        {
          name: "Update an Employee Role",
          value: "UPDATE_EMPLOYEE_ROLE",
        },
        {
          name: "Quit",
          value: "QUIT"
        }
      ],
    },
  ]).then((response) => {
      let choice = response.choice;
    switch (choice) {
      case 'VIEW_EMPLOYEES':
        viewEmployees();
        break;
      case 'VIEW_DEPARTMENTS':
        viewDepartments();
        break;
        case 'VIEW_ROLES':
        viewRoles();
        break;
        case 'ADD_A_ROLE':
        addRole();
        break;
        case 'ADD_EMPLOYEE':
        addEmployee();
        break;
        case "ADD_DEPARTMENT":
        addDepartment();
        break;
        case "UPDATE_EMPLOYEE_ROLE":
        updateEmployeeRole();
        break;
      default:
        quit();
    }
  });
}

function viewEmployees(){
    DB.findAllEmployees()
    .then(([rows]) => {
        let employees = rows;
    console.table(employees);
    }).then(()=> loadPrompts())

    
}

function viewDepartments(){
    DB.findAllDepartments()
    .then(([rows]) => {
        let departments = rows;
        console.table(departments);
    }).then(() => loadPrompts())
}

function viewRoles(){
    DB.findAllRoles()
    .then(([rows]) => {
        let roles = rows;
        console.table(roles);
    }).then(() => loadPrompts())
}

function addDepartment() {
  prompt([
    {
      name: "name",
      message: "What is the name of the department?"
    }
  ])
    .then(res => {
      let name = res;
      DB.createDepartment(name)
        .then(() => console.log(`Added the ${name.name} department to the database`))
        .then(() => loadPrompts())
    })
}


function addRole(){
  DB.findAllDepartments()
  .then(([rows]) => {
    let departments = rows;
    const departmentChoices = departments.map(({ id, name }) => ({
      name: name,
      value: id
    }));

    prompt([
      {
        name: "title",
        message: "Please specify the name of the role."
      },
      {
        name: "salary",
        message: "What is the annual salary for this role?"
      },
      {
        type: "list",
        name: "department_id",
        message: "Which department should this role be assigned to?",
        choices: departmentChoices
      }
    ])
      .then(role => {
        DB.createRole(role)
          .then(() => console.log(`The role ${role.title} was added to the database`))
          .then(() => loadPrompts())
      })
  })
}

function addEmployee() {
  prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      message: "What is the employee's last name?"
    }
  ])
    .then(res => {
      let firstName = res.first_name;
      let lastName = res.last_name;

      DB.findAllRoles()
        .then(([rows]) => {
          let roles = rows;
          const roleChoices = roles.map(({ id, title }) => ({
            name: title,
            value: id
          }));

          prompt({
            type: "list",
            name: "roleId",
            message: "What is the employee's role?",
            choices: roleChoices
          })
            .then(res => {
              let roleId = res.roleId;

              DB.findAllEmployees()
                .then(([rows]) => {
                  let employees = rows;
                  const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                    name: `${first_name} ${last_name}`,
                    value: id
                  }));

                  managerChoices.unshift({ name: "None", value: null });

                  prompt({
                    type: "list",
                    name: "managerId",
                    message: "Who is the employee's manager?",
                    choices: managerChoices
                  })
                    .then(res => {
                      let employee = {
                        manager_id: res.managerId,
                        role_id: roleId,
                        first_name: firstName,
                        last_name: lastName
                      }

                      DB.createEmployee(employee);
                    })
                    .then(() => console.log(
                      `Added ${firstName} ${lastName} to the database`
                    ))
                    .then(() => loadPrompts())
                })
            })
        })
    })
}


function updateEmployeeRole() {
  DB.findAllEmployees()
    .then(([rows]) => {
      let employees = rows;
      const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));

      prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Please specify Which employee's role you need to update?",
          choices: employeeChoices
        }
      ])
        .then(res => {
          let employeeId = res.employeeId;
          DB.findAllRoles()
            .then(([rows]) => {
              let roles = rows;
              const roleChoices = roles.map(({ id, title }) => ({
                name: title,
                value: id
              }));

              prompt([
                {
                  type: "list",
                  name: "roleId",
                  message: "Which role will this employee be assigned?",
                  choices: roleChoices
                }
              ])
                .then(res => DB.updateEmployeeRole(employeeId, res.roleId))
                .then(() => console.log("The Employee's role has been updated."))
                .then(() => loadPrompts())
            });
        });
    })
}

function quit(){
    console.log("Exiting the program!");
    process.exit();
}
