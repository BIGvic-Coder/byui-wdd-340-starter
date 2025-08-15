const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || "postgresql://localhost:5432/my_local_db",
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
