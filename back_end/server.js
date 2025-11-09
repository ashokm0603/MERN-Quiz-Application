require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const { errorHandler } = require("./middlewares/errorMiddleware");
const attemptRoutes = require("./routes/attemptRoutes");
const reportRoutes = require("./routes/reportRoutes"); // ✅
const app = express();

app.use(cors());
app.use(express.json());

// connect DB
connectDB(process.env.MONGO_URI);

// routes
app.use("/api/attempts", attemptRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/reports", reportRoutes);

// health
app.get("/", (req, res) =>
  res.send({ status: "ok", time: new Date().toISOString() })
);

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
