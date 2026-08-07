const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const authHeader =
      req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token =
      authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : authHeader;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    console.log("Decoded User:", decoded);

    req.user = decoded;

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error.message
    );

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = auth;