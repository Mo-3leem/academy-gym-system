const express = require("express");
const router = express.Router();
const Plan = require("../models/Plan");

// create a new plan
router.post("/", async (req, res) => {
  try {
    const plan = new Plan(req.body);
    await plan.save();
    res.status(201).json({ message: "تم إضافة الخطة", plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء إضافة الخطة" });
  }
});

// get all plans, optionally filtered by type
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    const plans = await Plan.find(query).sort({ durationDays: 1 });
    res.json(plans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء جلب الخطط" });
  }
});

module.exports = router;
