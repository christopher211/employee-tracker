import clear from "clear";
import figlet from "figlet";

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
};

init();
