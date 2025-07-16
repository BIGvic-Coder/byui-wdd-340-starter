const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");

// Route to handle vehicle detail by inventory ID
router.get("/detail/:inv_id", invController.buildInventoryDetail);

// Export the router
module.exports = router;
