// Importing necessary libraries
const fs = require("fs");
const path = require("path");
const readline = require("readline");

function toKebabCase(str) {
  return (
    str &&
    str
      .replace(/([a-z])([A-Z])/g, "$1-$2") // get all lowercase letters that are near to uppercase ones
      .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2") // get all uppercase letters that are near to lowercase ones
      .replace(/[\s_]+/g, "-")
      .toLowerCase()
  );
}

// Prepare input reader
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Getting path of package.json file
const targetPath = path.join(process.cwd(), "package.json");

// Reading package.json file
fs.readFile(targetPath, "utf8", (err, data) => {
  if (err) throw err;

  // Parsing JSON content
  let packageJson = JSON.parse(data);

  // Changing the library name
  let libName = toKebabCase(packageJson.name);

  // Ask user to confirm or change it
  rl.question(`library name: ("${libName}") `, (answer) => {
    if (answer.trim() !== "") libName = answer.trim();
    packageJson.name = libName;

    // Stringify JSON contents
    const jsonContent = JSON.stringify(packageJson, null, 2);

    // Write new JSON content to package.json file
    fs.writeFile(targetPath, jsonContent, "utf8", function (err) {
      if (err) {
        console.log("An error occurred while writing JSON to File.");
        return console.log(err);
      }
    });
  });
});
