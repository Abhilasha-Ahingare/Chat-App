const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json("you are not authenticated !");
  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err) return res.status(403).json("token is not valid !");
    // req.userId = decoded.id;
    req.userId = payload.userId;
    next();
  });
};

module.exports = verifyToken;
