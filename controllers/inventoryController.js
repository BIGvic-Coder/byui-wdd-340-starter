const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

// Controller for showing vehicle detail
async function buildByInventoryId(req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const vehicle = await invModel.getVehicleById(inv_id);
    const nav = await utilities.getNav();

    res.render("inventory/vehicle-detail", {
      title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle,
    });
  } catch (error) {
    next(error);
  }
}

// Controller for showing vehicles by classification
async function buildByClassification(req, res, next) {
  try {
    const classification = req.params.classification;
    const vehicles = await invModel.getVehiclesByClassification(classification);
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
  buildByInventoryId,
  buildByClassification,
};
