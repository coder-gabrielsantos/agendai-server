const Reservation = require("../model/reservationModel");

// GET /reservations - Get only today's and future reservations
exports.getAllReservations = async (req, res) => {
    try {
        const today = new Date(
            new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
        )
            .toISOString()
            .split("T")[0];

        const reservations = await Reservation.find({
            date: { $gte: today }
        }).sort({ date: -1 });

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
        // Build conflict query
        const conflictQuery = {
            date,
            timeslots: { $in: timeslots },
        };

        const orConditions = [];

        if (datashow) {
            orConditions.push({ datashow });
        }
        if (speaker) {
            orConditions.push({ speaker });
        }

        if (orConditions.length > 0) {
            conflictQuery.$or = orConditions;
        }

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

// POST /reservations/available - Get only available resources
exports.getAvailableResources = async (req, res) => {
    const { date, timeslots } = req.body;

    if (!date || !timeslots || timeslots.length === 0) {
        return res.status(400).json({ error: "Missing date or timeslots" });
    }

    try {
        // Fetch all reservations that conflict with the selected timeslots
        const reservations = await Reservation.find({
            date,
            timeslots: { $in: timeslots },
        });

        const usedDatashows = new Set();
        const usedSpeakers  = new Set();

        for (const r of reservations) {
            if (r.datashow && typeof r.datashow === "string") {
                usedDatashows.add(r.datashow);
            }
            if (r.speaker && typeof r.speaker === "string") {
                usedSpeakers.add(r.speaker);
            }
        }

        const allDatashows = [
            "Datashow 1",
            "Datashow 2",
            "Datashow 3",
            "Datashow 4",
            "Datashow 5",
            "Datashow 6",
        ];

        const allSpeakers = [
            "Caixa de som 1",
            "Caixa de som 2",
            "Caixa de som 3",
            "Caixa de som 4",
        ];

        const availableDatashows = allDatashows.filter((d) => !usedDatashows.has(d));
        const availableSpeakers = allSpeakers.filter((s) => !usedSpeakers.has(s));

        res.json({
            datashows: availableDatashows,
            speakers: availableSpeakers,
        });
    } catch (err) {
        console.error("Error fetching available resources:", err);
        res.status(500).json({ error: "Failed to fetch available resources" });
    }
};

// DELETE /reservations/cleanup - Delete past reservations
exports.deleteOldReservations = async (req, res) => {
    try {
        const today = new Date(
            new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
        )
            .toISOString()
            .split("T")[0];

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
