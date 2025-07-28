// routes/static.js

const express = require("express");
const router = express.Router();
const utilities = require("../utilities");

// Home route - renders views/index.ejs
router.get("/", async (req, res) => {
  const nav = await utilities.getNav();
  res.render("index", {
    title: "Home",
    nav,
  });
});

module.exports = router;
