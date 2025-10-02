// server.js
require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./src/config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/docs/swagger");

const app = express();

// Middlewares
app.use(helmet());
const allowedOrigins = [
  "https://abdullah-week3-day3-frontend.vercel.app",
  "https://abdullah-week3-day3-frontend.vercel.app/",
  "http://localhost:5173", // keep for local dev
];

// validate required env vars early so we fail fast on deployment
const requiredEnvs = ["JWT_SECRET", "MONGO_URI"];
const missing = requiredEnvs.filter((k) => !process.env[k]);
if (missing.length) {
  console.warn("Missing required environment variables:", missing.join(", "));
  // continue running; log a warning instead of exiting so serverless
  // platforms don't return FUNCTION_INVOCATION_FAILED immediately.
}
// small logger to help debug deployed Origin header
app.use((req, res, next) => {
  console.log(
    "Request:",
    req.method,
    req.url,
    "Origin:",
    req.headers.origin || "no-origin"
  );
  next();
});

// Allow all origins (no credentials). This sets Access-Control-Allow-Origin: '*'.
// If you need cookies/auth via credentials, use origin: true and credentials: true instead.
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(morgan("dev"));

// Add a route to handle the root path
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// Routes
app.use("/api/users", require("./src/routes/authRoutes"));
app.use("/api/tasks", require("./src/routes/taskRoutes"));

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  // ensure CORS header is present on error responses
  // when using origin: '*' we can safely set wildcard
  res.setHeader("Access-Control-Allow-Origin", "*");
  res
    .status(500)
    .json({ message: "Server Error", error: err.message || String(err) });
});

app.use((req, res) => res.status(404).json({ message: "route not found" }));
// Start server
const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error("Failed to start:", err);
    process.exit(1);
  }
};
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

start();
