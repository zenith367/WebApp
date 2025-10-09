const db = require("../config/db");

class Report {
  static async create(data) {
    const query = `
      INSERT INTO reports 
      (faculty, class_name, week, date, course_name, course_code, lecturer, present, registered, venue, time, topic, outcomes, recommendations) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`;
    const values = [
      data.faculty, data.class_name, data.week, data.date,
      data.course_name, data.course_code, data.lecturer, data.present,
      data.registered, data.venue, data.time, data.topic,
      data.outcomes, data.recommendations
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async getAll() {
    const result = await db.query("SELECT * FROM reports ORDER BY date DESC");
    return result.rows;
  }
}

module.exports = Report;
