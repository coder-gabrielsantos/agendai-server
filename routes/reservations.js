const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");

// GET: todas as reservas
router.get("/", reservationController.getAllReservations);

// POST: nova reserva
router.post("/", reservationController.createReservation);

// DELETE: remover reservas antigas (manual ou via cron)
router.delete("/cleanup", reservationController.deleteOldReservations);

module.exports = router;
