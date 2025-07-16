const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

// Controller function to build the inventory detail view
async function buildInventoryDetailView(req, res, next) {
  try {
    const invId = parseInt(req.params.invId);
    const data = await invModel.getInventoryById(invId);
    const html = utilities.buildDetailHTML(data);
    res.render("./inventory/detail", {
      title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
      html,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildInventoryDetailView,
};
