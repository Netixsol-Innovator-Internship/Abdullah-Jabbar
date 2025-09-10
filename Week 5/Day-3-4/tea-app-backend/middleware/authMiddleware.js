const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "super-admin") {
    return res
      .status(403)
      .json({ message: "Admin or Super Admin access required" });
  }
  next();
};
