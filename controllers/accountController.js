const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const accountModel = require("../models/accountModel");

/**
 * Render register page
 */
async function buildRegister(req, res) {
  res.render("account/register", { title: "Register", errors: null });
}

/**
 * Handle account registration
 */
async function registerAccount(req, res) {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create account
    const newAccount = await accountModel.registerAccount(
      firstname,
      lastname,
      email,
      hashedPassword
    );

    req.flash("success", "Account registered successfully. Please log in.");
    res.redirect("/account/login");
  } catch (err) {
    console.error("Registration error:", err);
    req.flash("error", "Registration failed. Email may already be in use.");
    res.redirect("/account/register");
  }
}

/**
 * Render login page
 */
async function buildLogin(req, res) {
  res.render("account/login", { title: "Login", errors: null });
}

/**
 * Handle login
 */
async function loginAccount(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash("error", "Please enter both email and password.");
      return res.redirect("/account/login");
    }

    const account = await accountModel.getAccountByEmail(email);

    if (!account) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/account/login");
    }

    const match = await bcrypt.compare(password, account.account_password);
    if (!match) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/account/login");
    }

    // Create JWT
    const token = jwt.sign(
      {
        account_id: account.account_id,
        account_firstname: account.account_firstname,
        account_lastname: account.account_lastname,
        account_email: account.account_email,
        account_type: account.account_type,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });
    res.redirect("/account/manage");
  } catch (err) {
    console.error("Login error:", err);
    req.flash("error", "Login failed.");
    res.redirect("/account/login");
  }
}

/**
 * Logout
 */
function logout(req, res) {
  res.clearCookie("jwt");
  req.flash("success", "Logged out successfully.");
  res.redirect("/");
}

/**
 * Render account management page
 */
async function buildAccountManagement(req, res) {
  const account = await accountModel.getAccountById(
    res.locals.accountData.account_id
  );
  res.render("account/manage", { title: "Account Management", account });
}

/**
 * Render account update form
 */
async function getUpdateView(req, res) {
  const account = await accountModel.getAccountById(req.params.id);
  res.render("account/update", { title: "Update Account", account });
}

/**
 * Handle account info update
 */
async function updateAccountInfo(req, res) {
  try {
    const { account_id, firstname, lastname, email } = req.body;
    await accountModel.updateAccountInfo(
      account_id,
      firstname,
      lastname,
      email
    );
    req.flash("success", "Account info updated successfully.");
    res.redirect("/account/manage");
  } catch (err) {
    console.error(err);
    req.flash("error", "Account update failed.");
    res.redirect(`/account/update/${req.body.account_id}`);
  }
}

/**
 * Handle password update
 */
async function updatePassword(req, res) {
  try {
    const { account_id, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await accountModel.updatePassword(account_id, hashedPassword);
    req.flash("success", "Password updated successfully.");
    res.redirect("/account/manage");
  } catch (err) {
    console.error(err);
    req.flash("error", "Password update failed.");
    res.redirect(`/account/update/${req.body.account_id}`);
  }
}

module.exports = {
  buildRegister,
  registerAccount,
  buildLogin,
  loginAccount,
  logout,
  buildAccountManagement,
  getUpdateView,
  updateAccountInfo,
  updatePassword,
};
