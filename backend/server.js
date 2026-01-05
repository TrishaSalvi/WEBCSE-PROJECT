const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Fixed typo from 'equire'

const connectDB = require("./lib/connectDB");
const authRoutes = require("./routes/authRoutes");
const groupRoutes = require("./routes/groupRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

// Middleware - MUST come before routes
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB(process.env.MONGO_URI);

// Register Routes
app.use("/auth", authRoutes);
app.use("/groups", groupRoutes);
app.use("/expenses", expenseRoutes);

// Health Check Route (Fixes the "Cannot GET /" 404 in your screenshot)
app.get("/", (req, res) => res.json({ message: "NovaSync Backend Running" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));