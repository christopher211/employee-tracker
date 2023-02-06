import clear from "clear";
import figlet from "figlet";
import menu from "./src/menu.js";

const welcomeScreen = async () => {
  clear();
  console.log("\n");
  console.log(
    "-----------------------------------------------------------------"
  );
  console.log(
    figlet.textSync("Employee", {
      font: "Standard",
      horizontalLayout: "default",
      verticalLayout: "default",
    })
  );
  console.log(
    figlet.textSync("Tracker", {
      font: "Standard",
      horizontalLayout: "default",
      verticalLayout: "default",
    })
  );
  console.log(
    "-----------------------------------------------------------------"
  );
};

const init = async () => {
  await welcomeScreen();
  await menu();
};

init();
