const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  // console.log(req.headers);
  // 1️⃣ Get token from cookie
  const token = req.cookies.token;
  // ! key-->Authorization
  // const authHeader = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Access Denied. No token provided",
    });
  }

  // !With Bearer
  //  if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //    return res.status(401).json({
  //      message: "No token provided",
  //    });
  //  }
  // const token = authHeader.split(" ")[1];

  try {
    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Attach decoded data to request
    // req.user = {
    //   id: decoded.id,
    //   username: decoded.username,
    // };
    // only for id
    req.user = decoded.id;

    // 4️⃣ Move to next
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or Expired Token",
    });
  }
};

module.exports = isAuthenticated;
