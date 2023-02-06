import { dbConnection } from "../config/connection.js";
import inquirer from "inquirer";
import menu from "./menu.js";

const processing = async (select) => {
  switch (select) {
    case "view_all_employee":
      await viewAllEmployee();
      break;
    case "add_employee":
      await addEmployee();
      break;
    case "update_employee_role":
      await updateEmployeeRole();
      break;
    case "view_all_role":
      await viewAllRole();
      break;
    case "add_role":
      await addRole();
      break;
    case "view_all_department":
      await viewAllDepartment();
      break;
    case "add_department":
      await addDepartment();
      break;
    case "exit":
      process.exit();
      break;
  }
};

// recursive function to ask user if they want to continue
const continuePrompt = async () => {
  const response = await inquirer.prompt([
    {
      type: "confirm",
      message: "Would you like to continue?",
      name: "continue",
    },
  ]);
  if (response.continue) {
    await menu();
  } else {
    process.exit();
  }
};

// view all employees from database by using query
const viewAllEmployee = async () => {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
  FROM employee
  LEFT JOIN role ON employee.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee manager ON manager.id = employee.manager_id`;
  const [rows, fields] = await dbConnection.execute(sql);
  console.table(rows);
  await continuePrompt();
};

// add employee to database by using inquirer to get first name, last name, role, and manager
const addEmployee = async () => {
  const sql = `SELECT * FROM role`;
  const [rows, fields] = await dbConnection.execute(sql);
  const roles = rows.map((role) => {
    return { name: role.title, value: role.id };
  });

  const sql2 = `SELECT * FROM employee`;
  const [rows2, fields2] = await dbConnection.execute(sql2);
  const managers = rows2.map((manager) => {
    return { name: manager.first_name, value: manager.id };
  });

  // add an option to select no manager
  managers.push({ name: "No Manager", value: null });

  const response = await inquirer.prompt([
    {
      type: "input",
      message: "Enter employee's first name",
      name: "first_name",
    },
    {
      type: "input",
      message: "Enter employee's last name",
      name: "last_name",
    },
    {
      type: "list",
      message: "Select employee's role",
      choices: roles,
      name: "role_id",
    },
    {
      type: "list",
      message: "Select employee's manager",
      choices: managers,
      name: "manager_id",
    },
  ]);

  const sql3 = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
  const params = [
    response.first_name,
    response.last_name,
    response.role_id,
    response.manager_id,
  ];
  const [rows3, fields3] = await dbConnection.execute(sql3, params);
  console.log("==== Employee added successfully ====");
  await continuePrompt();
};

// update employee role by using inquirer to get employee and role
const updateEmployeeRole = async () => {
  const sql = `SELECT * FROM employee`;
  const [rows, fields] = await dbConnection.execute(sql);
  const employees = rows.map((employee) => {
    return { name: employee.first_name, value: employee.id };
  });

  const sql2 = `SELECT * FROM role`;
  const [rows2, fields2] = await dbConnection.execute(sql2);
  const roles = rows2.map((role) => {
    return { name: role.title, value: role.id };
  });

  const response = await inquirer.prompt([
    {
      type: "list",
      message: "Select employee",
      choices: employees,
      name: "employee_id",
    },
    {
      type: "list",
      message: "Select employee's new role",
      choices: roles,
      name: "role_id",
    },
  ]);

  const sql3 = `UPDATE employee SET role_id = ? WHERE id = ?`;
  const params = [response.role_id, response.employee_id];
  const [rows3, fields3] = await dbConnection.execute(sql3, params);
  console.log("==== Employee role updated successfully ====");
  await continuePrompt();
};

// view all roles from database by using query
const viewAllRole = async () => {
  const sql = `SELECT role.id, role.title, department.name AS department, role.salary
  FROM role
  LEFT JOIN department ON role.department_id = department.id`;
  const [rows, fields] = await dbConnection.execute(sql);
  console.table(rows);
  await continuePrompt();
};

// add role to database by using inquirer to get title, salary, and department
const addRole = async () => {
  const sql = `SELECT * FROM department`;
  const [rows, fields] = await dbConnection.execute(sql);
  const departments = rows.map((department) => {
    return { name: department.name, value: department.id };
  });

  const response = await inquirer.prompt([
    {
      type: "input",
      message: "Enter role title",
      name: "title",
    },
    {
      type: "input",
      message: "Enter role salary",
      name: "salary",
    },
    {
      type: "list",
      message: "Select role department",
      choices: departments,
      name: "department_id",
    },
  ]);

  const sql2 = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
  const params = [response.title, response.salary, response.department_id];
  const [rows2, fields2] = await dbConnection.execute(sql2, params);
  console.log("==== Role added successfully ====");
  await continuePrompt();
};

// view all departments from database by using query
const viewAllDepartment = async () => {
  const sql = `SELECT * FROM department`;
  const [rows, fields] = await dbConnection.execute(sql);
  console.table(rows);
  await continuePrompt();
};

// add department to database by using inquirer to get department name
const addDepartment = async () => {
  const response = await inquirer.prompt([
    {
      type: "input",
      message: "Enter department name",
      name: "name",
    },
  ]);

  const sql = `INSERT INTO department (name) VALUES (?)`;
  const params = [response.name];
  const [rows, fields] = await dbConnection.execute(sql, params);
  console.log("==== Department added successfully ====");
  await continuePrompt();
};

export default processing;
