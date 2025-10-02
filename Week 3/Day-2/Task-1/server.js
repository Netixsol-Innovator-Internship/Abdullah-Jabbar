// server.js
require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/docs/swagger');

const app = express();

// Middlewares
app.use(helmet());
const allowedOrigins = [
  "https://abdullah-week3-day3-frontend.vercel.app",
  "http://localhost:5173" // keep for local dev
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


app.use(express.json());
app.use(morgan('dev'));

// Root route - returns API status and quick links
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Welcome to the Task API',
    env: process.env.NODE_ENV || 'development',
    routes: {
      users: '/api/users',
      tasks: '/api/tasks',
      docs: '/api-docs'
    }
  });
});
// Routes
app.use('/api/users', require('./src/routes/authRoutes'));
app.use('/api/tasks', require('./src/routes/taskRoutes'));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});


app.use((req, res) => res.status(404).json({ message: 'route not found' }));
// Start server
const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Failed to start:', err);
    process.exit(1);
  }
};
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

start();
