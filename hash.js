const bcrypt = require("bcrypt");

const password = "testpassword"; // Change this to your desired password
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function (err, hash) {
  if (err) {
    console.error(err);
    return;
  }
  console.log("Hashed password:", hash);
});
