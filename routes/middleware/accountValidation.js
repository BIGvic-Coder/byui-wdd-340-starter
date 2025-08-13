const { body, validationResult } = require("express-validator");
// Fixed import path: go up two levels from routes/middleware to models folder
const accountModel = require("../../models/accountModel");

/**
 * Validation rules for updating account info
 */
const validateAccountUpdate = [
  body("firstname")
    .trim()
    .isLength({ min: 1 })
    .withMessage("First name is required."),
  body("lastname")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Last name is required."),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required.")
    .custom(async (email, { req }) => {
      const existingAccount = await accountModel.getAccountByEmail(email);
      if (
        existingAccount &&
        existingAccount.account_id != req.body.account_id
      ) {
        throw new Error("Email already in use.");
      }
      return true;
    }),
];

/**
 * Validation rules for updating password
 */
const validatePasswordUpdate = [
  body("newPassword")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
];

/**
 * Middleware to handle validation errors
 */
function checkValidationResults(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const flashErrors = errors.array().map((err) => err.msg);
    req.flash("error", flashErrors.join(" "));
    return res.redirect("back");
  }
  next();
}

module.exports = {
  validateAccountUpdate,
  validatePasswordUpdate,
  checkValidationResults,
};
