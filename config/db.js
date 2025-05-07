const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error("❌ MONGODB_URI is undefined!");
    process.exit(1);
}

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", err => console.error("❌ MongoDB connection error:", err));
db.once("open", () => console.log("✅ MongoDB connected"));

module.exports = db;
