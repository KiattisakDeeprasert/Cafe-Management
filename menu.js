import { execSync } from "child_process";
import inquirer from "inquirer";

inquirer
  .prompt([
    {
      type: "list",
      name: "option",
      message: "Select an option:",
      choices: [
        { name: "Backend", value: "1" },
        { name: "Admin", value: "2" },
        { name: "User", value: "3" }
      ]
    }
  ])
  .then(({ option }) => {
    // Map user selection to corresponding scripts
    const script = {
      "1": "bun run dev:backend",
      "2": "bun run dev:admin",
      "3": "bun run dev:user"
    }[option];

    // Execute the selected script
    if (script) {
      console.log(`Running ${script}`);
      execSync(script, { stdio: "inherit" });
    } else {
      console.error("Invalid option selected. Please choose a valid option.");
    }
  })
  .catch((error) => {
    console.error("An error occurred:", error);
  });
