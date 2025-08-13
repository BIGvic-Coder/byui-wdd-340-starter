const express = require("express");
const router = express.Router();

// Controllers
const accountController = require("../controllers/accountController");

// Middleware
const {
  decodeJWT,
  verifyJWT,
  requireAuth,
} = require("./middleware/authMiddleware"); // ✅ corrected path

const {
  validateAccountUpdate,
  validatePasswordUpdate,
  checkValidationResults,
} = require("./middleware/accountValidation"); // ✅ corrected path

// Registration routes
router.get("/register", accountController.buildRegister);
router.post("/register", accountController.registerAccount);

// Login routes
router.get("/login", accountController.buildLogin);
router.post("/login", accountController.loginAccount);

// Logout route
router.get("/logout", accountController.logout);

// Account management (protected)
router.get(
  "/manage",
  verifyJWT,
  requireAuth,
  accountController.buildAccountManagement
);

// Update account info
router.get(
  "/update/:id",
  verifyJWT,
  requireAuth,
  accountController.getUpdateView
);
router.post(
  "/update-info",
  verifyJWT,
  requireAuth,
  validateAccountUpdate,
  checkValidationResults,
  accountController.updateAccountInfo
);

// Update password
router.post(
  "/update-password",
  verifyJWT,
  requireAuth,
  validatePasswordUpdate,
  checkValidationResults,
  accountController.updatePassword
);

module.exports = router;
