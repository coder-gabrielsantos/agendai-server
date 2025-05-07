const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const reservationRoutes = require("./routes/reservations");
const db = require("./config/db"); // MongoDB connection

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/reservations", reservationRoutes);

// Export the app for Vercel serverless deployment
module.exports = app;

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running at port ${PORT}`);
});