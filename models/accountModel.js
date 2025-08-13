const pool = require("../database/");

/**
 * Create a new account
 */
async function registerAccount(firstname, lastname, email, password) {
  const sql = `
    INSERT INTO account
    (account_firstname, account_lastname, account_email, account_password, account_type)
    VALUES ($1, $2, $3, $4, 'Client')
    RETURNING account_id, account_firstname, account_lastname, account_email, account_type;
  `;
  const result = await pool.query(sql, [firstname, lastname, email, password]);
  return result.rows[0];
}

/**
 * Find an account by email (case-insensitive)
 */
async function getAccountByEmail(email) {
  const sql = `
    SELECT account_id, account_firstname, account_lastname, account_email, account_password, account_type
    FROM account
    WHERE LOWER(account_email) = LOWER($1)
  `;
  const result = await pool.query(sql, [email]);
  return result.rows[0];
}

/**
 * Find an account by ID
 */
async function getAccountById(id) {
  const sql = `
    SELECT account_id, account_firstname, account_lastname, account_email, account_type
    FROM account
    WHERE account_id = $1
  `;
  const result = await pool.query(sql, [id]);
  return result.rows[0];
}

/**
 * Update account information
 */
async function updateAccountInfo(account_id, firstname, lastname, email) {
  const sql = `
    UPDATE account
    SET account_firstname = $1,
        account_lastname = $2,
        account_email = $3
    WHERE account_id = $4
    RETURNING account_id, account_firstname, account_lastname, account_email, account_type;
  `;
  const result = await pool.query(sql, [
    firstname,
    lastname,
    email,
    account_id,
  ]);
  return result.rows[0];
}

/**
 * Update account password
 */
async function updatePassword(account_id, hashedPassword) {
  const sql = `
    UPDATE account
    SET account_password = $1
    WHERE account_id = $2
    RETURNING account_id;
  `;
  const result = await pool.query(sql, [hashedPassword, account_id]);
  return result.rows[0];
}

module.exports = {
  registerAccount,
  getAccountByEmail,
  getAccountById,
  updateAccountInfo,
  updatePassword,
};
