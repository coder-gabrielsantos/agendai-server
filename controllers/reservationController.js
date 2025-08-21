const Reservation = require("../model/reservationModel");

// GET /reservations - Get only today's and future reservations
exports.getAllReservations = async (req, res) => {
    try {
        const brazilTimeNow = new Date(
            new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
        );

        // Calculate cutoff (2 days before now)
        const cutoffDate = new Date(brazilTimeNow);
        cutoffDate.setDate(cutoffDate.getDate() - 2);
        const formattedCutoff = cutoffDate.toISOString().split("T")[0];

        await Reservation.deleteMany({ date: { $lt: formattedCutoff } });

        const today = brazilTimeNow.toISOString().split("T")[0];

        // Get today's and future reservations
        const reservations = await Reservation.find({
            date: { $gte: today },
        }).sort({ date: -1 });

        res.json(reservations);
    } catch (err) {
        console.error("Error fetching reservations:", err);
        res.status(500).json({ error: "Failed to fetch reservations" });
    }
};

// POST /reservations - Create a new reservation
exports.createReservation = async (req, res) => {
    const { professorName, date, timeslots, datashow, speaker, space } = req.body;

    try {
        const conflictQuery = {
            date,
            timeslots: { $in: timeslots },
        };

        const orConditions = [];
        if (datashow) orConditions.push({ datashow });
        if (speaker)  orConditions.push({ speaker });
        if (space)    orConditions.push({ space });

        if (orConditions.length > 0) conflictQuery.$or = orConditions;

        const conflicts = await Reservation.find(conflictQuery);
        if (conflicts.length > 0) {
            return res.status(409).json({
                error: "Resource already reserved for selected timeslot(s)",
                code: "CONFLICT",
            });
        }

        const newReservation = new Reservation({
            professorName,
            date,
            timeslots,
            datashow: datashow || null,
            speaker: speaker || null,
            space: space || null,
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
        const reservations = await Reservation.find({
            date,
            timeslots: { $in: timeslots },
        });

        const usedDatashows = new Set();
        const usedSpeakers  = new Set();
        const usedSpaces    = new Set();

        for (const r of reservations) {
            if (r.datashow) usedDatashows.add(r.datashow);
            if (r.speaker)  usedSpeakers.add(r.speaker);
            if (r.space)    usedSpaces.add(r.space);
        }

        const allDatashows = ["Datashow 1", "Datashow 2", "Datashow 3", "Datashow 4", "Datashow 5", "Datashow 6"];
        const allSpeakers  = ["Caixa de som 1", "Caixa de som 2", "Caixa de som 3"];
        const allSpaces    = ["Lab de Enfermagem", "Lab de Informática", "Auditório"];

        res.json({
            datashows: allDatashows.filter(d => !usedDatashows.has(d)),
            speakers:  allSpeakers.filter(s => !usedSpeakers.has(s)),
            spaces:    allSpaces.filter(sp => !usedSpaces.has(sp)),
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
