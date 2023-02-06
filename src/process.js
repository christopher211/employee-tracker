import { dbConnection } from "../config/connection.js";
import inquirer from "inquirer";
import menu from "./menu.js";

const processing = async (select) => {
  switch (select) {
    case "view_all_employee":
      await viewAllEmployee();
      break;
    case "view_all_employee_by_manager":
      await viewAllEmployeeByManager();
      break;
    case "view_all_employee_by_department":
      await viewAllEmployeeByDepartment();
      break;
    case "add_employee":
      await addEmployee();
      break;
    case "update_employee_role":
      await updateEmployeeRole();
      break;
    case "update_employee_manager":
      await updateEmployeeManager();
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
    case "utilized_budget":
      await viewDepartmentSalaries();
      break;
    case "add_department":
      await addDepartment();
      break;
    case "delete_employee":
      await deleteEmployee();
      break;
    case "delete_role":
      await deleteRole();
      break;
    case "delete_department":
      await deleteDepartment();
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

// view all employees by manager from database by using query
const viewAllEmployeeByManager = async () => {
  const sql = `SELECT * FROM employee`;
  const [rows, fields] = await dbConnection.execute(sql);
  const managers = rows.map((manager) => {
    return { name: manager.first_name, value: manager.id };
  });

  const response = await inquirer.prompt([
    {
      type: "list",
      message: "Select a manager",
      choices: managers,
      name: "manager",
    },
  ]);

  const sql2 = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
  FROM employee
  LEFT JOIN role ON employee.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee manager ON manager.id = employee.manager_id
  WHERE manager.id = ?`;
  const [rows2, fields2] = await dbConnection.execute(sql2, [response.manager]);
  console.table(rows2);
  await continuePrompt();
};

// view all employees by department from database by using query
const viewAllEmployeeByDepartment = async () => {
  const sql = `SELECT * FROM department`;
  const [rows, fields] = await dbConnection.execute(sql);
  const departments = rows.map((department) => {
    return { name: department.name, value: department.id };
  });

  const response = await inquirer.prompt([
    {
      type: "list",
      message: "Select a department",
      choices: departments,
      name: "department",
    },
  ]);

  const sql2 = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager

  FROM employee
  LEFT JOIN role ON employee.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee manager ON manager.id = employee.manager_id
  WHERE department.id = ?`;
  const [rows2, fields2] = await dbConnection.execute(sql2, [
    response.department,
  ]);
  console.table(rows2);
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

// update employee manager by using inquirer to get employee and manager
const updateEmployeeManager = async () => {
  const sql = `SELECT * FROM employee`;
  const [rows, fields] = await dbConnection.execute(sql);
  const employees = rows.map((employee) => {
    return { name: employee.first_name, value: employee.id };
  });

  const sql2 = `SELECT * FROM employee`;
  const [rows2, fields2] = await dbConnection.execute(sql2);
  const managers = rows2.map((manager) => {
    return { name: manager.first_name, value: manager.id };
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
      message: "Select employee's new manager",
      choices: managers,
      name: "manager_id",
    },
  ]);

  const sql3 = `UPDATE employee SET manager_id = ? WHERE id = ?`;
  const params = [response.manager_id, response.employee_id];
  const [rows3, fields3] = await dbConnection.execute(sql3, params);
  console.log("==== Employee manager updated successfully ====");
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

// view the combined salaries of all employees by department using inquirer to get department and query to get salaries and total employees of each department
const viewDepartmentSalaries = async () => {
  const sql = `SELECT * FROM department`;
  const [rows, fields] = await dbConnection.execute(sql);
  const departments = rows.map((department) => {
    return { name: department.name, value: department.id };
  });

  // add option to select all departments
  departments.push({ name: "All Departments", value: "all" });

  const response = await inquirer.prompt([
    {
      type: "list",
      message: "Select department",
      choices: departments,
      name: "department_id",
    },
  ]);

  // if all departments selected, get salaries for all departments
  if (response.department_id === "all") {
    const sql2 = `SELECT department.name AS department, SUM(role.salary) AS total_salary, COUNT(employee.id) as total_employees
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    GROUP BY department.name`;
    const [rows2, fields2] = await dbConnection.execute(sql2);
    console.table(rows2);
  } else {
    const sql2 = `SELECT department.name AS department, SUM(role.salary) AS total_salary, COUNT(employee.id) as total_employees
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    WHERE department.id = ?
    GROUP BY department.name`;
    const params = [response.department_id];
    const [rows2, fields2] = await dbConnection.execute(sql2, params);
    console.table(rows2);
  }
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

// delete employee from database by using inquirer to get employee
const deleteEmployee = async () => {
  const sql = `SELECT * FROM employee`;
  const [rows, fields] = await dbConnection.execute(sql);
  const employees = rows.map((employee) => {
    return { name: employee.first_name, value: employee.id };
  });

  const response = await inquirer.prompt([
    {
      type: "list",
      message: "Select employee to delete",
      choices: employees,
      name: "employee_id",
    },
    {
      type: "confirm",
      message: "Are you sure you want to proceed?",
      name: "confirm",
      default: false,
    },
  ]);

  if (!response.confirm) {
    console.log("==== Employee not deleted ====");
  } else {
    const sql2 = `DELETE FROM employee WHERE id = ?`;
    const params = [response.employee_id];
    const [rows2, fields2] = await dbConnection.execute(sql2, params);
    console.log("==== Employee deleted successfully ====");
  }
  await continuePrompt();
};

// delete role from database by using inquirer to get role
const deleteRole = async () => {
  const sql = `SELECT * FROM role`;
  const [rows, fields] = await dbConnection.execute(sql);
  const roles = rows.map((role) => {
    return { name: role.title, value: role.id };
  });

  const response = await inquirer.prompt([
    {
      type: "list",
      message: "Select role to delete",
      choices: roles,
      name: "role_id",
    },
    {
      type: "confirm",
      message: "Are you sure you want to proceed?",
      name: "confirm",
      default: false,
    },
  ]);

  if (!response.confirm) {
    console.log("==== Role not deleted ====");
  } else {
    // delete employees with role
    const sql1 = `DELETE FROM employee WHERE role_id = ?`;
    const params1 = [response.role_id];
    const [rows1, fields1] = await dbConnection.execute(sql1, params1);

    // delete role
    const sql2 = `DELETE FROM role WHERE id = ?`;
    const params = [response.role_id];
    const [rows2, fields2] = await dbConnection.execute(sql2, params);
    console.log("==== Role deleted successfully ====");
  }
  await continuePrompt();
};

// delete department from database by using inquirer to get department
const deleteDepartment = async () => {
  const sql = `SELECT * FROM department`;
  const [rows, fields] = await dbConnection.execute(sql);
  const departments = rows.map((department) => {
    return { name: department.name, value: department.id };
  });

  const response = await inquirer.prompt([
    {
      type: "list",
      message: "Select department to delete",
      choices: departments,
      name: "department_id",
    },
    {
      type: "confirm",
      message: "Are you sure you want to proceed?",
      name: "confirm",
      default: false,
    },
  ]);

  if (!response.confirm) {
    console.log("==== Department not deleted ====");
  } else {
    // delete employees in department
    const sql1 = `DELETE FROM employee WHERE role_id IN (SELECT id FROM role WHERE department_id = ?)`;
    const params1 = [response.department_id];
    const [rows1, fields1] = await dbConnection.execute(sql1, params1);

    // delete roles in department
    const sql2 = `DELETE FROM role WHERE department_id = ?`;
    const params2 = [response.department_id];
    const [rows2, fields2] = await dbConnection.execute(sql2, params2);

    // delete department
    const sql3 = `DELETE FROM department WHERE id = ?`;
    const params3 = [response.department_id];
    const [rows3, fields3] = await dbConnection.execute(sql3, params3);
    console.log("==== Department deleted successfully ====");
  }
  await continuePrompt();
};

export default processing;
