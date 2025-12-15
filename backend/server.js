const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Routes
const memberRoutes = require("./routes/members");
const sportRoutes = require("./routes/sports");
const coachRoutes = require("./routes/coaches");
const groupRoutes = require("./routes/groups");
const planRoutes = require("./routes/plans");
const subscriptionRoutes = require("./routes/subscriptions");
const attendanceRoutes = require("./routes/attendance");
const paymentRoutes = require("./routes/payments");

// Use Routes
app.use("/api/members", memberRoutes);
app.use("/api/sports", sportRoutes);
app.use("/api/coaches", coachRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/payments", paymentRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Sports Club Management API (MySQL + Prisma)",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
