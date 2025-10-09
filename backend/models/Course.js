const db = require("../config/db");

class Course {
  static async create({ name, code }) {
    const result = await db.query(
      "INSERT INTO courses (name, code) VALUES ($1,$2) RETURNING *",
      [name, code]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await db.query("SELECT * FROM courses");
    return result.rows;
  }
}

module.exports = Course;
