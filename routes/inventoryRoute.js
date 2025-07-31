const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const invController = require("../controllers/inventoryController");

// Management view
router.get("/", invController.buildManagement);

// Add Classification form (GET)
router.get("/add-classification", invController.buildAddClassification);

// Add Classification submission (POST) with validation
router.post(
  "/add-classification",
  [
    check("classification_name")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Classification name must be at least 3 characters.")
      .isAlphanumeric()
      .withMessage(
        "Classification name must contain only letters and numbers."
      ),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const nav = await require("../utilities").getNav();
      return res.status(400).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        message: null,
        errors: errors.array(),
        classification_name: req.body.classification_name,
      });
    }
    invController.addClassification(req, res, next);
  }
);

// Add Vehicle form (GET)
router.get("/add-inventory", invController.buildAddVehicle);

// Add Vehicle submission (POST) with validation
router.post(
  "/add-inventory",
  [
    check("classification_id")
      .notEmpty()
      .withMessage("Classification is required."),
    check("inv_make").trim().notEmpty().withMessage("Make is required."),
    check("inv_model").trim().notEmpty().withMessage("Model is required."),
    check("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),
    check("inv_image").trim().notEmpty().withMessage("Image path is required."),
    check("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),
    check("inv_price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be a positive number."),
    check("inv_year")
      .isInt({ min: 1900 })
      .withMessage("Year must be a valid year."),
    check("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be zero or more."),
    check("inv_color").trim().notEmpty().withMessage("Color is required."),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const nav = await require("../utilities").getNav();
      const classifications =
        await require("../models/inventory-model").getClassifications();
      return res.status(400).render("inventory/add-vehicle", {
        title: "Add New Vehicle",
        nav,
        classifications,
        message: null,
        errors: errors.array(),
        data: req.body,
      });
    }
    invController.addVehicle(req, res, next);
  }
);

// View vehicles by classification
router.get("/type/:classification", invController.buildByClassification);

// Vehicle details view
router.get("/detail/:inv_id", invController.buildByInventoryId);

module.exports = router;
