/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const env = require("dotenv").config();
const expressLayouts = require("express-ejs-layouts"); // ADD THIS
const app = express();
const static = require("./routes/static");

/* ***********************
 * View Engine and Static Folder
 *************************/
app.set("view engine", "ejs"); // Tell Express to use EJS
app.set("layout", "./layout"); // Tell EJS where to find the layout
app.use(expressLayouts); // Use express-ejs-layouts
app.use(express.static("public")); // Serve static files from /public

/* ***********************
 * Routes
 *************************/
// Static routes
app.use(static);

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
const invRoute = require("./routes/inventoryRoute");
app.use("/inventory", invRoute);
