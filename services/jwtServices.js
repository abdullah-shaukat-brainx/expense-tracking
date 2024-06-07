const jwt = require("jsonwebtoken");

const verifyToken = (token, key) => {
  return jwt.verify(token, key);
};
const generateTokenWithSecret = (user, secret) => {
  return jwt.sign(user, secret,{ expiresIn: "3600s" });
};
module.exports = {
  verifyToken,
  generateTokenWithSecret,
};
