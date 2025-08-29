const express = require("express");
const cors = require("cors");
const reservationRoutes = require("./routes/reservations");
require("dotenv").config();
require("./config/db");

const app = express();

const allowedOrigins = [
    "https://agendai-server.vercel.app" // backend em produção
];

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Routes
app.use("/reservations", reservationRoutes);

// Export for Vercel serverless
module.exports = app;