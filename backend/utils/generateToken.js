// utils/generateToken.js
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "devsecret", {
    expiresIn: "7d",
  });
};

module.exports = generateToken;
