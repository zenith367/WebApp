const db = require("../config/db");

class ClassModel {
  static async create({ name, venue, time }) {
    const result = await db.query(
      "INSERT INTO classes (name, venue, time) VALUES ($1,$2,$3) RETURNING *",
      [name, venue, time]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await db.query("SELECT * FROM classes");
    return result.rows;
  }
}

module.exports = ClassModel;
