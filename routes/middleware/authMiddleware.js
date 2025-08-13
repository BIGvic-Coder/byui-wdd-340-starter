const jwt = require("jsonwebtoken");

/**
 * Middleware to decode JWT from cookies for every request (optional, but recommended)
 */
function decodeJWT(req, res, next) {
  const token = req.cookies?.jwt;
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.accountData = decoded; // Make user info available in views
  } catch (err) {
    res.clearCookie("jwt"); // clear invalid token
  }
  next();
}

/**
 * Verify JWT token from cookies (for protected routes)
 */
function verifyJWT(req, res, next) {
  const token = req.cookies?.jwt;
  if (!token) {
    req.flash("error", "Authentication required.");
    return res.redirect("/account/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    res.locals.accountData = decoded; // <-- Add this so views can access accountData on protected routes
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    req.flash("error", "Session expired. Please log in again.");
    res.clearCookie("jwt");
    return res.redirect("/account/login");
  }
}

/**
 * Require authentication
 */
function requireAuth(req, res, next) {
  if (!req.user) {
    req.flash("error", "You must be logged in.");
    return res.redirect("/account/login");
  }
  next();
}

/**
 * Require Admin or Employee roles
 */
function requireAdminOrEmployee(req, res, next) {
  if (!req.user || !["Admin", "Employee"].includes(req.user.account_type)) {
    req.flash("error", "You do not have permission to view this page.");
    return res.redirect("/account/manage");
  }
  next();
}

module.exports = {
  decodeJWT,
  verifyJWT,
  requireAuth,
  requireAdminOrEmployee,
};
