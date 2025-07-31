const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

// Management view
async function buildManagement(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const message = req.flash("message")[0];
    console.log("Flash message on /inv:", message); // Added debug log
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      message,
    });
  } catch (error) {
    next(error);
  }
}

// Show Add Classification form
async function buildAddClassification(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      message: req.flash("message")[0],
      errors: [],
      classification_name: "",
    });
  } catch (error) {
    next(error);
  }
}

// Process Add Classification POST
async function addClassification(req, res, next) {
  try {
    const { classification_name } = req.body;

    const result = await invModel.insertClassification(classification_name);

    if (result) {
      req.flash("message", "Classification added successfully.");
      res.redirect("/inv");
    } else {
      req.flash("message", "Failed to add classification.");
      res.redirect("/inv/add-classification");
    }
  } catch (error) {
    next(error);
  }
}

// Show Add Vehicle form
async function buildAddVehicle(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classifications = await invModel.getClassifications();

    res.render("inventory/add-vehicle", {
      title: "Add New Vehicle",
      nav,
      classifications,
      message: req.flash("message")[0],
      errors: [],
      data: {},
    });
  } catch (error) {
    next(error);
  }
}

// Process Add Vehicle POST
async function addVehicle(req, res, next) {
  try {
    const vehicle = req.body;
    const result = await invModel.insertVehicle(vehicle);

    if (result) {
      req.flash("message", "Vehicle added successfully.");
      res.redirect("/inv");
    } else {
      req.flash("message", "Failed to add vehicle.");
      // If failed, re-render with sticky data
      const nav = await utilities.getNav();
      const classifications = await invModel.getClassifications();
      res.status(500).render("inventory/add-vehicle", {
        title: "Add New Vehicle",
        nav,
        classifications,
        message: req.flash("message")[0],
        errors: [],
        data: vehicle,
      });
    }
  } catch (error) {
    next(error);
  }
}

// Show vehicle detail view
async function buildByInventoryId(req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const vehicle = await invModel.getVehicleById(inv_id);
    const nav = await utilities.getNav();

    if (!vehicle) {
      return res.status(404).render("errors/404", {
        title: "Vehicle Not Found",
        nav,
      });
    }

    res.render("inventory/vehicle-detail", {
      title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle,
    });
  } catch (error) {
    next(error);
  }
}

// Show vehicles by classification
async function buildByClassification(req, res, next) {
  try {
    const classification = req.params.classification;
    const vehicles = await invModel.getVehiclesByClassification(classification);

    console.log("Vehicles for classification:", classification, vehicles);

    const nav = await utilities.getNav();
    const title =
      classification.charAt(0).toUpperCase() + classification.slice(1);
    const grid = await utilities.buildClassificationGrid(vehicles);

    res.render("inventory/classification", {
      title: `${title} Vehicles`,
      nav,
      classificationName: title,
      vehicles,
      grid,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildManagement,
  buildAddClassification,
  addClassification,
  buildAddVehicle,
  addVehicle,
  buildByInventoryId,
  buildByClassification,
};
