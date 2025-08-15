require("dotenv").config();

const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();

// Parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// JWT decode middleware
const { decodeJWT } = require("./routes/middleware/authMiddleware");
app.use(decodeJWT);

// Serve static files
app.use(express.static("public"));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "devSecret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

// Flash messages
app.use(flash());

// Navigation & flash locals
const { getNav } = require("./utilities/index");
app.use(async (req, res, next) => {
  res.locals.messages = req.flash();
  res.locals.nav = await getNav();
  next();
});

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "layout");
app.use(expressLayouts);

// Routes
const accountRoutes = require("./routes/accountRoute");
const staticRoutes = require("./routes/static");
const invRoute = require("./routes/inventoryRoute");
const profileRoutes = require("./routes/profileRoutes"); // ✅ fixed

app.use("/account", accountRoutes);
app.use("/inv", invRoute);
app.use("/profile", profileRoutes);
app.use("/", staticRoutes);

// Home route
app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).render("errors/500", {
    title: "Server Error",
    message: "Something went wrong on the server. Please try again later.",
  });
});

// Start server
const port = process.env.PORT || 5501;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`✅ App listening at http://${host}:${port}`);
});
