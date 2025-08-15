const pool = require("../database"); // uses database/index.js

/**
 * Get profile by user ID
 */
async function getProfileByUserId(userId) {
  const sql = `
    SELECT user_id, first_name, last_name, bio
    FROM profiles
    WHERE user_id = $1
  `;
  const result = await pool.query(sql, [userId]);
  return result.rows[0];
}

/**
 * Update profile details
 */
async function updateProfile(userId, first_name, last_name, bio) {
  const sql = `
    UPDATE profiles
    SET first_name = $1, last_name = $2, bio = $3
    WHERE user_id = $4
    RETURNING user_id, first_name, last_name, bio
  `;
  const result = await pool.query(sql, [first_name, last_name, bio, userId]);
  return result.rows[0];
}

module.exports = {
  getProfileByUserId,
  updateProfile,
};
