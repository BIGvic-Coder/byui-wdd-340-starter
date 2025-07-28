const express = require("express");
const router = new express.Router();
const invController = require("../controllers/inventoryController");

// Route to display vehicles by classification
router.get("/type/:classification", invController.buildByClassification);

// Route to display single vehicle detail
router.get("/detail/:inv_id", invController.buildByInventoryId);

// Route to trigger error (Assignment 3 Task 3)
router.get("/error", (req, res, next) => {
  try {
    throw new Error("Intentional error triggered.");
  } catch (error) {
    next(error); // Pass error to middleware
  }
});

module.exports = router;
