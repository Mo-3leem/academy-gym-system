const express = require("express");
const router = express.Router();
const Sport = require("../models/Sport");

// create a new sport
router.post("/", async (req, res) => {
  try {
    const sport = new Sport(req.body);
    await sport.save();
    res.status(201).json({ message: "تم إضافة الرياضة", sport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء إضافة الرياضة" });
  }
});

// get all sports
router.get("/", async (req, res) => {
  try {
    const sports = await Sport.find().sort({ name: 1 });
    res.json(sports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء جلب الرياضات" });
  }
});

module.exports = router;
