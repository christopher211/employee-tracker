import inquirer from "inquirer";
import processing from "./process.js";

const menu = async () => {
  const response = await inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      choices: [
        { name: "View all Employees", value: "view_all_employee" },
        {
          name: "View all Employees by Manager",
          value: "view_all_employee_by_manager",
        },
        {
          name: "View all Employees by Department",
          value: "view_all_employee_by_department",
        },
        { name: "Add Employee", value: "add_employee" },
        { name: "Update Employee Role", value: "update_employee_role" },
        { name: "Update Employee Manager", value: "update_employee_manager" },
        { name: "View all Roles", value: "view_all_role" },
        { name: "Add Role", value: "add_role" },
        { name: "View all Department", value: "view_all_department" },
        {
          name: "View utilized budget of a Department",
          value: "utilized_budget",
        },
        { name: "Add Department", value: "add_department" },
        { name: "Delete Employee", value: "delete_employee" },
        { name: "Delete Role", value: "delete_role" },
        { name: "Delete Department", value: "delete_department" },
        { name: "Exit", value: "exit" },
      ],
      name: "select",
    },
  ]);

  await processing(response.select);
};

export default menu;
