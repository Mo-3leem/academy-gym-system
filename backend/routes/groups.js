const express = require("express");
const router = express.Router();
const Group = require("../models/Group");

// create a new group
router.post("/", async (req, res) => {
  try {
    const group = new Group(req.body);
    await group.save();
    res.status(201).json({ message: "تم إضافة الجروب", group });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء إضافة الجروب" });
  }
});

// get all groups, optionally filtered by sportId
router.get("/", async (req, res) => {
  try {
    const { sportId } = req.query;
    const query = sportId ? { sportId } : {};
    const groups = await Group.find(query)
      .populate("sportId")
      .populate("coachId");
    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء جلب الجروبات" });
  }
});

module.exports = router;
