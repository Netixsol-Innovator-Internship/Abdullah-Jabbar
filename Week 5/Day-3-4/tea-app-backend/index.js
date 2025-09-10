const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

dotenv.config();
connectDB();

const authRoutes = require("./routes/authRoutes");
const teaRoutes = require("./routes/teaRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();

// ✅ CORS setup for deployed frontend
app.use(
  cors({
    origin: "*", // your deployed frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // if you are using cookies/auth
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/teas", teaRoutes);
app.use("/api/cart", cartRoutes);

const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
