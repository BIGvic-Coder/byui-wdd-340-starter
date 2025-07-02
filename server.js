/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");

/* ***********************
 * View Engine and Static Folder
 *************************/
app.set("view engine", "ejs"); // Tell Express to use EJS
app.use(express.static("public")); // Serve static files from /public

/* ***********************
 * Routes
 *************************/
// Static routes
app.use(static);

// Home route (renders the index.ejs page)
app.get("/", (req, res) => {
  res.render("index");
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
