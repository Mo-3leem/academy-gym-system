const express = require("express");
const router = express.Router();
const Coach = require("../models/Coach");

// create a new coach
router.post("/", async (req, res) => {
  try {
    const coach = new Coach(req.body);
    await coach.save();
    res.status(201).json({ message: "تم إضافة المدرب", coach });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء إضافة المدرب" });
  }
});

// get all coaches
router.get("/", async (req, res) => {
  try {
    const coaches = await Coach.find().sort({ name: 1 });
    res.json(coaches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء جلب المدربين" });
  }
});

module.exports = router;
