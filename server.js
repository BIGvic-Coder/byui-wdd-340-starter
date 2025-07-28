const express = require("express");
const env = require("dotenv").config();
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const app = express();

// ✅ Serve static files from /public
app.use(express.static("public"));

// ✅ Set views directory and EJS layout engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "layout"); // ✅ Uses views/layout.ejs
app.use(expressLayouts);

// Routes
const static = require("./routes/static");
const invRoute = require("./routes/inventoryRoute");

// Apply routes
app.use(static);
app.use("/inventory", invRoute);

// Test route to verify server is working
app.get("/", (req, res) => {
  res.render("home", {
    title: "Home",
    nav: "<a href='/inventory'>Inventory</a>",
  });
});

// ❗ Intentional 500 error trigger route
app.get("/trigger-error", (req, res, next) => {
  next(new Error("Intentional Server Error"));
});

// ✅ Global error-handling middleware
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).render("errors/500", {
    title: "Server Error",
    nav: "<a href='/'>Home</a>",
    message: "Something went wrong on the server. Please try again later.",
  });
});

// Server config
const port = process.env.PORT || 5501;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`✅ App listening at http://${host}:${port}`);
});
