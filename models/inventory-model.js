const pool = require("../database/");

async function getVehicleById(inv_id) {
  try {
    const sql = `SELECT * FROM inventory WHERE inv_id = $1`;
    const result = await pool.query(sql, [inv_id]);
    return result.rows[0];
  } catch (error) {
    console.error("getVehicleById error:", error);
    throw error;
  }
}

async function getVehiclesByClassification(classification) {
  try {
    const sql = `
      SELECT i.inv_id, i.inv_make, i.inv_model, i.inv_price, i.inv_thumbnail
      FROM inventory i
      JOIN classification c ON i.classification_id = c.classification_id
      WHERE LOWER(c.classification_name) = LOWER($1)
    `;
    const result = await pool.query(sql, [classification]);
    return result.rows;
  } catch (error) {
    console.error("getVehiclesByClassification error:", error);
    throw error;
  }
}

async function getClassifications() {
  try {
    const sql = `SELECT classification_name FROM classification ORDER BY classification_name`;
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    console.error("getClassifications error:", error);
    throw error;
  }
}

module.exports = {
  getVehicleById,
  getVehiclesByClassification,
  getClassifications,
};
