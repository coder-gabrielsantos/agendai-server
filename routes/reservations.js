const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");

// POST /reservations
router.post("/", reservationController.createReservation);

// GET /reservations
router.get("/", reservationController.getAllReservations);

module.exports = router;
