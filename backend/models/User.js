// models/User.js
const db = require("../config/db");

class User {
  static async create({ name, email, password, role }) {
    const result = await db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1,$2,$3,$4) RETURNING id, name, email, role`,
      [name, email, password, role]
    );
    return result.rows[0];
  }

  // Case-insensitive lookup
  static async findByEmail(email) {
    const result = await db.query(
      `SELECT id, name, email, password, role
       FROM users WHERE LOWER(email) = LOWER($1)`,
      [email]
    );
    return result.rows[0];
  }
}

module.exports = User;
