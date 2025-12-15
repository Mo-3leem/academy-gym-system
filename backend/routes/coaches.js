const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

router.post("/", async (req, res) => {
  try {
    const coach = await prisma.coach.create({
      data: {
        name: req.body.name,
        phone: req.body.phone || null,
      },
    });
    res.status(201).json({ message: "تم إضافة المدرب", coach });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء إضافة المدرب" });
  }
});

router.get("/", async (req, res) => {
  try {
    const coaches = await prisma.coach.findMany({ orderBy: { name: "asc" } });
    res.json(coaches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء جلب المدربين" });
  }
});

module.exports = router;
