const Reservation = require("../model/reservationModel");

// GET /reservations - Get all reservations
exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ date: 1 });
        res.json(reservations);
    } catch (err) {
        console.error("Error fetching reservations:", err);
        res.status(500).json({ error: "Failed to fetch reservations" });
    }
};

// POST /reservations - Create a new reservation
exports.createReservation = async (req, res) => {
    const { professorName, date, timeslots, datashow, speaker } = req.body;

    try {
        // Check for scheduling conflicts with other reservations
        const conflictQuery = {
            date,
            timeslots: { $in: timeslots },
            $or: [
                { datashow: datashow || null },
                { speaker: speaker || null },
            ],
        };

        const conflicts = await Reservation.find(conflictQuery);

        if (conflicts.length > 0) {
            return res.status(409).json({
                error: "Resource already reserved for selected timeslot(s)",
                code: "CONFLICT",
            });
        }

        // Create and save new reservation
        const newReservation = new Reservation({
            professorName,
            date,
            timeslots,
            datashow: datashow || null,
            speaker: speaker || null,
        });

        const saved = await newReservation.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error("Error creating reservation:", err);
        res.status(500).json({ error: "Failed to create reservation" });
    }
};

// DELETE /reservations/cleanup - Delete past reservations
exports.deleteOldReservations = async (req, res) => {
    try {
        const today = new Date().toISOString().split("T")[0]; // e.g. "2025-05-07"
        const result = await Reservation.deleteMany({ date: { $lt: today } });

        res.json({
            message: "Old reservations removed successfully",
            deletedCount: result.deletedCount,
        });
    } catch (err) {
        console.error("Error deleting old reservations:", err);
        res.status(500).json({ error: "Failed to delete old reservations" });
    }
};
