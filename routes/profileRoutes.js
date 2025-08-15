const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

// Show profile
router.get("/", profileController.buildProfile);

// Update profile
router.post("/update", profileController.updateProfile);

module.exports = router;
