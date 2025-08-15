const { body, validationResult } = require("express-validator");

function profileRules() {
  return [
    body("first_name").trim().notEmpty().withMessage("First name is required"),
    body("last_name").trim().notEmpty().withMessage("Last name is required"),
    body("bio")
      .trim()
      .isLength({ max: 250 })
      .withMessage("Bio cannot exceed 250 characters"),
  ];
}

function checkProfileData(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash(
      "errors",
      errors.array().map((err) => err.msg)
    );
    return res.redirect("/profile");
  }
  next();
}

module.exports = { profileRules, checkProfileData };
