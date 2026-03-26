const bcrypt = require('bcrypt');
const fs = require("fs");
const inputPassword = process.argv[2];

if (!inputPassword) {
  console.log("Please provide a password.");
  process.exit(1);
}

const storedHash = fs.readFileSync("password.txt","utf8").trim();
bcrypt.compare(inputPassword, storedHash, (err, result) => {
    if (err) {
    console.error("Error comparing password:", err);
    return;
  }
  if (result) {
    console.log("Match successful");
  } else {
    console.log("Invalid password");
  }
});