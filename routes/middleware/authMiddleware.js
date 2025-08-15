const jwt = require("jsonwebtoken");

/**
 * Middleware to require JWT (protect routes)
 */
function verifyJWT(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    req.flash("error", "You must be logged in to view this page.");
    return res.redirect("/account/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.accountData = decoded;
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    req.flash("error", "Invalid session. Please log in again.");
    res.clearCookie("jwt");
    res.redirect("/account/login");
  }
}

/**
 * Middleware to just decode JWT without blocking
 */
function decodeJWT(req, res, next) {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.accountData = decoded;
    } catch (err) {
      res.locals.accountData = null;
    }
  } else {
    res.locals.accountData = null;
  }
  next();
}

/**
 * Middleware to require authentication (alias for verifyJWT)
 */
function requireAuth(req, res, next) {
  return verifyJWT(req, res, next);
}

module.exports = { decodeJWT, verifyJWT, requireAuth };
