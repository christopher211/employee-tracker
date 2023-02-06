import inquirer from "inquirer";
import processing from "./process.js";

const menu = async () => {
  const response = await inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      choices: [
        { name: "View all Employees", value: "view_all_employee" },
        { name: "Add Employee", value: "add_employee" },
        { name: "Update Employee Role", value: "update_employee_role" },
        { name: "View all Roles", value: "view_all_role" },
        { name: "Add Role", value: "add_role" },
        { name: "View all Department", value: "view_all_department" },
        { name: "Add Department", value: "add_department" },
        { name: "Exit", value: "exit" },
      ],
      name: "select",
    },
  ]);

  await processing(response.select);
};

export default menu;
