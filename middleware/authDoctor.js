const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "Unauthorised access" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.doctor = decoded.doctor;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
