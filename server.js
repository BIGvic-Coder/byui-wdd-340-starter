const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const env = require("dotenv").config();
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const app = express();

// Import dynamic nav function
const { getNav } = require("./utilities/index");

// Serve static files from /public
app.use(express.static("public"));

// Add body parser for form data
app.use(express.urlencoded({ extended: true }));

// Setup session middleware
app.use(
  session({
    secret: "yourSecretHere", // Replace with a secure secret string
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }, // 1 minute
  })
);

// Setup flash middleware
app.use(flash());

// Make flash messages & nav available in all views
app.use(async (req, res, next) => {
  res.locals.messages = req.flash();
  res.locals.nav = await getNav();
  next();
});

// Set views directory and EJS layout engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "layout");
app.use(expressLayouts);

// Routes
const static = require("./routes/static");
const invRoute = require("./routes/inventoryRoute");

// Mount routes with /inv prefix to align with your routes & controllers
app.use(static);
app.use("/inv", invRoute);

// Home route
app.get("/", (req, res) => {
  res.render("home", {
    title: "Home",
  });
});

// Error trigger route
app.get("/trigger-error", (req, res, next) => {
  next(new Error("Intentional Server Error"));
});

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).render("errors/500", {
    title: "Server Error",
    message: "Something went wrong on the server. Please try again later.",
  });
});

// Server config
const port = process.env.PORT || 5501;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`✅ App listening at http://${host}:${port}`);
});
