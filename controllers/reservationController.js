const reservationModel = require("../model/reservationModel");

const createReservation = (req, res) => {
    const { professorName, date, datashow, speaker, timeslots } = req.body;

    if (!professorName || !date || !timeslots || timeslots.length === 0) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const reservationData = {
        professorName,
        date,
        datashow,
        speaker,
        timeslots,
    };

    reservationModel.createReservation(reservationData, (err, result) => {
        if (err) {
            console.error("Error creating reservation:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        res.status(201).json({ message: "Reservation created", reservation: result });
    });
};

const getAllReservations = (req, res) => {
    reservationModel.getAllReservations((err, reservations) => {
        if (err) {
            console.error("Error fetching reservations:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        res.json(reservations);
    });
};

const deleteOldReservations = (req, res) => {
    reservationModel.deleteOldReservations((err, result) => {
        if (err) {
            console.error("Erro ao excluir reservas antigas:", err);
            res.status(500).json({ error: "Erro ao excluir reservas antigas" });
        } else {
            res.json({
                message: "Reservas antigas removidas com sucesso",
                affectedRows: result.affectedRows,
            });
        }
    });
};

module.exports = {
    createReservation,
    getAllReservations,
    deleteOldReservations
};
