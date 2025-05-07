const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const reservationRoutes = require("./routes/reservations");
require("dotenv").config();
require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/reservations", reservationRoutes);

// Export for Vercel serverless
module.exports = app;