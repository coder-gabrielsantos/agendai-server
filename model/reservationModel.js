const mongoose = require("mongoose");

// Define the schema for a reservation document
const ReservationSchema = new mongoose.Schema({
    professorName: {
        type: String,
        required: true,
    },
    date: {
        type: String, // Format: "YYYY-MM-DD"
        required: true,
    },
    datashow: {
        type: String,
        default: null,
    },
    speaker: {
        type: String,
        default: null,
    },
    timeslots: [
        {
            type: Number, // 1 to 9
            required: true,
        },
    ],
});

// Export the model
module.exports = mongoose.model("Reservation", ReservationSchema);