const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // 1️⃣ Get token from cookie
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Access Denied. No token provided",
    });
  }

  try {
    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Attach decoded data to request
    req.user = decoded;

    // 4️⃣ Move to next
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or Expired Token",
    });
  }
};

module.exports = authMiddleware;
