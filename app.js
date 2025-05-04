const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cron = require("node-cron");
const reservationRoutes = require("./routes/reservations");
const reservationModel = require("./model/reservationModel");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/reservations", reservationRoutes);

// CRON: Remove reservas antigas diariamente às 00:01
cron.schedule("1 0 * * *", () => {
    console.log("[CRON] Limpando reservas antigas...");
    reservationModel.deleteOldReservations((err, result) => {
        if (err) {
            console.error("[CRON] Erro ao excluir reservas antigas:", err);
        } else {
            console.log(`[CRON] ${result.affectedRows} reservas antigas removidas.`);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
