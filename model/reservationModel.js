const db = require("../config/db");

// Create reservation and its timeslots
function createReservation(data, callback) {
    const { professorName, date, datashow, speaker, timeslots } = data;

    const insertReservation = `
    INSERT INTO reservations (professor_name, date, datashow, speaker)
    VALUES (?, ?, ?, ?)
  `;

    db.query(
        insertReservation,
        [professorName, date, datashow, speaker],
        (err, result) => {
            if (err) return callback(err);

            const reservationId = result.insertId;

            const insertTimeslots = `
        INSERT INTO reservation_timeslots (reservation_id, timeslot)
        VALUES ?
      `;

            const values = timeslots.map((slot) => [reservationId, slot]);

            db.query(insertTimeslots, [values], (err) => {
                if (err) return callback(err);
                callback(null, { id: reservationId, ...data });
            });
        }
    );
}

// Get all reservations with associated timeslots
function getAllReservations(callback) {
    const query = `
    SELECT r.id, r.professor_name, r.date, r.datashow, r.speaker,
           GROUP_CONCAT(rt.timeslot ORDER BY rt.timeslot) AS timeslots
    FROM reservations r
    LEFT JOIN reservation_timeslots rt ON r.id = rt.reservation_id
    GROUP BY r.id
    ORDER BY r.date ASC
  `;

    db.query(query, (err, results) => {
        if (err) return callback(err);

        const formatted = results.map((row) => ({
            id: row.id,
            professorName: row.professor_name,
            date: row.date,
            datashow: row.datashow,
            speaker: row.speaker,
            timeslots: row.timeslots
                ? row.timeslots.split(",").map((t) => parseInt(t))
                : [],
        }));

        callback(null, formatted);
    });
}

module.exports = {
    createReservation,
    getAllReservations,
};
