// routes/static.js

const express = require("express");
const router = express.Router();

// Home route - renders views/index.ejs
router.get("/", (req, res) => {
  res.render("index");
});

module.exports = router;
