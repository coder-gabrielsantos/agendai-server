const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const reservationRoutes = require("./routes/reservations");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/reservations", reservationRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("Agendaí backend is running 🚀");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
