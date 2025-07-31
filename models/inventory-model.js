const pool = require("../database/");

// Get a vehicle by ID
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

// Get vehicles by classification name
async function getVehiclesByClassification(classification) {
  try {
    if (!classification) {
      throw new Error("Classification parameter is required");
    }
    console.log("Classification param:", classification); // Debug log
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

// Get all classifications
async function getClassifications() {
  try {
    const sql = `SELECT classification_id, classification_name FROM classification ORDER BY classification_name`;
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    console.error("getClassifications error:", error);
    throw error;
  }
}

// Insert a new classification and return new ID
async function insertClassification(classification_name) {
  try {
    const sql = `
      INSERT INTO classification (classification_name)
      VALUES ($1)
      RETURNING classification_id
    `;
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0];
  } catch (error) {
    console.error("insertClassification error:", error);
    throw error;
  }
}

// Insert a new vehicle and return new ID
async function insertVehicle(vehicle) {
  try {
    const sql = `
      INSERT INTO inventory (
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING inv_id
    `;
    const values = [
      vehicle.inv_make,
      vehicle.inv_model,
      vehicle.inv_year,
      vehicle.inv_description,
      vehicle.inv_image,
      vehicle.inv_thumbnail,
      vehicle.inv_price,
      vehicle.inv_miles,
      vehicle.inv_color,
      vehicle.classification_id,
    ];
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    console.error("insertVehicle error:", error);
    throw error;
  }
}

module.exports = {
  getVehicleById,
  getVehiclesByClassification,
  getClassifications,
  insertClassification,
  insertVehicle,
};
